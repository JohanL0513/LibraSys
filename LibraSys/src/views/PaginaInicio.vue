<template>
  <div class="pagina-inicio">
    <div class="header">
      <button :class="{ activo: vista === 'login' }" @click="vista = 'login'">Iniciar sesión</button>
      <button :class="{ activo: vista === 'registro' }" @click="vista = 'registro'">Registrarse</button>
    </div>

    <div class="form-container">
      <!-- FORMULARIO DE REGISTRO -->
      <div v-if="vista === 'registro'" class="form-box">
        <h2>Regístrate En <span class="marca">LibraSys</span></h2>
        <p class="descripcion">El catálogo de nuestra biblioteca abierto a cualquier hora</p>

        <hr />

        <h3>Información de la cuenta</h3>
        <form @submit.prevent="enviarRegistro">
          <div class="fila">
            <div class="campo">
              <label>Primer nombre</label>
              <input type="text" placeholder="nombre" />
            </div>
            <div class="campo">
              <label>Segundo nombre</label>
              <input type="text" placeholder="segundo nombre" />
            </div>
          </div>

          <div class="fila">
            <div class="campo">
              <label>E-mail</label>
              <input type="email" placeholder="E-mail" />
            </div>
            <div class="campo">
              <label>Apellido</label>
              <input type="text" placeholder="apellido" />
            </div>
          </div>

          <div class="fila">
            <div class="campo">
              <label>País</label>
              <select>
                <option>Colombia (Cali)</option>
                <option>México</option>
                <option>Argentina</option>
              </select>
            </div>
            <div class="campo">
              <label>Teléfono</label>
              <input type="text" placeholder="teléfono" />
            </div>
          </div>

          <button type="submit" class="btn-primario">Registrarme</button>
        </form>
      </div>

      <!-- FORMULARIO DE LOGIN -->
      <div v-else class="form-box">
        <h2>Inicia sesión en <span class="marca">LibraSys</span></h2>
        <p class="descripcion">Accede a tu cuenta para gestionar tus préstamos y libros</p>

        <hr />

        <!-- Paso 1: Login -->
        <form v-if="paso === 'login'" @submit.prevent="enviarLogin">
          <div class="campo">
            <label>E-mail</label>
            <input v-model="email" type="email" placeholder="Tu correo" />
          </div>
          <div class="campo">
            <label>Contraseña</label>
            <input v-model="password" type="password" placeholder="Tu contraseña" />
          </div>

          <button type="submit" class="btn-primario">Ingresar</button>
        </form>

        <!-- Paso 2: Verificación -->
        <form v-else @submit.prevent="verificarCodigo">
          <div class="campo">
            <label>Ingresa el código enviado</label>
            <input v-model="codigoIngresado" type="text" maxlength="6" placeholder="Ej: 123456" />
          </div>

          <button type="submit" class="btn-primario">Verificar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script src="../components/PaginaInicio.js"></script>
<style src="../assets/paginaInicio.css"></style>
