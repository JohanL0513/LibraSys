<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0; /* Quita el espacio blanco */
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  background: #1a1a2e;
  padding: 1rem;
}

.navbar a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.navbar a.router-link-exact-active {
  color: #00aaff; /* Color activo */
}
</style>