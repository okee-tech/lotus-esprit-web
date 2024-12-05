type SocketState<T = unknown> = {
  state: Ref<T | undefined>;
  isConnected: Ref<boolean>;
  error: Ref<string | null>;
  cleanup: () => void;
};

export const useSocketState = <T = unknown>(
  stateId: string,
  initialState?: T
): SocketState<T> => {
  const socket = useSocket("/shared-state");
  const state = ref<T | undefined>(undefined);
  const isConnected = ref(false);
  const error = ref<string | null>(null);
  const isExternalUpdated = ref(false);

  // Connection handling
  const connectHandler = () => {
    isConnected.value = true;
    socket.emit("join-room", stateId);
    socket.emit("request-state", stateId);
  };

  const disconnectHandler = () => {
    isConnected.value = false;
  };

  const errorHandler = (err: string) => {
    error.value = err;
  };

  const stateUpdateHandler = (newState: T) => {
    isExternalUpdated.value = true;
    state.value = newState;
  };

  const currentStateHandler = (currentState: T, isInitialized: boolean) => {
    if (!isInitialized) return (state.value = initialState);
    stateUpdateHandler(currentState);
  };

  socket.on("connect", connectHandler);
  socket.on("disconnect", disconnectHandler);
  socket.on("error", errorHandler);
  socket.on("state-update", stateUpdateHandler);
  socket.on("current-state", currentStateHandler);

  const stopWatch = watch(
    state,
    (newValue) => {
      if (!isExternalUpdated.value)
        socket.emit("state-change", {
          stateId,
          state: newValue,
        });

      isExternalUpdated.value = false;
    },
    { deep: true }
  );

  const cleanup = () => {
    socket.off("connect", connectHandler);
    socket.off("disconnect", disconnectHandler);
    socket.off("error", errorHandler);
    socket.off("state-update", stateUpdateHandler);
    socket.off("current-state", currentStateHandler);

    socket.emit("leave-room", stateId);
    socket.disconnect();

    stopWatch();
  };

  onUnmounted(() => {
    cleanup();
  });

  return { state: state as Ref<T | undefined>, isConnected, error, cleanup };
};

export type { SocketState };
