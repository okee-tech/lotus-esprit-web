<script setup lang="ts"></script>

<template>
  <div class="min-h-screen min-w-screen">
    <!-- Sticky header -->
    <header class="w-full bg-base-100 shadow-lg">
      <nav class="navbar container mx-auto px-4">
        <div class="flex-1">
          <div>DeLorean</div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="h-full mx-auto px-2 py-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>
