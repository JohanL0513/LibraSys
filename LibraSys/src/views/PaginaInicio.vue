<template>
  <div class="pagina-inicio">
    <div class="header">
      <button :class="{ activo: vista === 'login' }" @click="resetAll(); vista = 'login'">Iniciar sesión</button>
      <button :class="{ activo: vista === 'registro' }" @click="resetAll(); vista = 'registro'">Registrarse</button>
    </div>

    <div class="form-container">
      <!-- REGISTRO -->
      <div v-if="vista === 'registro'" class="form-box">
        <h2>Regístrate en <span class="marca">LibraSys</span></h2>
        <p class="descripcion">El catálogo de nuestra biblioteca abierto a cualquier hora</p>
        <hr />

        <form @submit.prevent="enviarRegistro">
          <div class="fila">
            <div class="campo">
              <label>Primer nombre</label>
              <input v-model="usuario.nombre" type="text" placeholder="Nombre" required />
            </div>
            <div class="campo">
              <label>Segundo nombre</label>
              <input v-model="usuario.segundoNombre" type="text" placeholder="Segundo nombre" />
            </div>
          </div>

          <div class="fila">
            <div class="campo">
              <label>E-mail</label>
              <input v-model="usuario.email" type="email" placeholder="E-mail" required />
            </div>
            <div class="campo">
              <label>Apellido</label>
              <input v-model="usuario.apellido" type="text" placeholder="Apellido" />
            </div>
          </div>

          <div class="fila">
            <div class="campo">
              <label>País</label>
              <select v-model="usuario.pais" required>
                <option disabled value="">Selecciona un país</option>
                <option>Colombia</option>
                <option>México</option>
                <option>Argentina</option>
              </select>
            </div>
            <div class="campo">
              <label>Teléfono</label>
              <input v-model="usuario.telefono" type="text" placeholder="Teléfono" />
            </div>
          </div>

          <div class="campo">
            <label>Contraseña</label>
            <input v-model="usuario.password" type="password" placeholder="Contraseña" required />
          </div>

          <div class="acciones">
            <button type="submit" class="btn-primario" :disabled="loading">
              {{ loading ? 'Registrando...' : 'Registrarme' }}
            </button>
          </div>
        </form>
      </div>

      <!-- LOGIN + 2FA -->
      <div v-else class="form-box">
        <h2>Inicia sesión en <span class="marca">LibraSys</span></h2>
        <p class="descripcion">Accede a tu cuenta para gestionar tus préstamos y libros</p>
        <hr />

        <!-- Paso 1: login -->
        <form v-if="!need2FA && paso === 'login'" @submit.prevent="enviarLogin">
          <div class="campo">
            <label>E-mail</label>
            <input v-model="email" type="email" placeholder="Tu correo" required />
          </div>
          <div class="campo">
            <label>Contraseña</label>
            <input v-model="password" type="password" placeholder="Tu contraseña" required />
          </div>

          <div class="acciones">
            <button type="submit" class="btn-primario" :disabled="loading">
              {{ loading ? 'Validando...' : 'Ingresar' }}
            </button>
          </div>
        </form>

        <!-- Paso 2: verificación 2FA -->
        <div v-else-if="need2FA">
          <p>Te hemos enviado un código de 6 dígitos. Introdúcelo para finalizar el inicio de sesión.</p>

          <form @submit.prevent="verificarCodigo">
            <div class="campo">
              <label>Código 2FA</label>
              <input v-model="codigoIngresado" type="text" maxlength="6" placeholder="123456" required />
            </div>

            <div class="acciones">
              <button type="submit" class="btn-primario" :disabled="loading">
                {{ loading ? 'Verificando...' : 'Verificar' }}
              </button>

              <button type="button" class="btn-secundario" @click="reenviarCodigo" :disabled="loading">
                Reenviar código
              </button>
            </div>

            <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
          </form>
        </div>

        <div v-else>
          <p>Estado inesperado. Recarga o inténtalo de nuevo.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaInicio',
  data() {
    return {
      vista: 'login', // 'registro' | 'login'
      paso: 'login',
      loading: false,
      mensaje: '',

      // Registro
      usuario: {
        nombre: '',
        segundoNombre: '',
        apellido: '',
        email: '',
        pais: '',
        telefono: '',
        password: ''
      },

      // Login
      email: '',
      password: '',

      // 2FA
      need2FA: false,
      userId2FA: null,
      codigoIngresado: ''
    };
  },
  methods: {
    resetAll() {
      this.loading = false;
      this.mensaje = '';
      this.usuario = {
        nombre: '',
        segundoNombre: '',
        apellido: '',
        email: '',
        pais: '',
        telefono: '',
        password: ''
      };
      this.email = '';
      this.password = '';
      this.need2FA = false;
      this.userId2FA = null;
      this.codigoIngresado = '';
      this.paso = 'login';
      this.vista = 'login';
    },

    // Registro
    async enviarRegistro() {
      if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password) {
        return alert('Nombre, email y contraseña son obligatorios.');
      }
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.usuario)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Error en el registro');

        alert('Registro exitoso. Ya puedes iniciar sesión.');
        this.resetAll();
        this.vista = 'login';
      } catch (err) {
        console.error('Registro error:', err);
        alert('Error en el registro: ' + (err.message || 'Error'));
      } finally {
        this.loading = false;
      }
    },

    // Login (inicia 2FA)
    async enviarLogin() {
      if (!this.email || !this.password) return alert('Email y contraseña son obligatorios.');
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');

        if (data.need2FA) {
          this.need2FA = true;
          this.userId2FA = data.userId;
          this.paso = 'verify';
          this.mensaje = 'Se envió un código 2FA. Revisa la consola del servidor (modo dev) o tu email/SMS.';
        } else if (data.token) {
          localStorage.setItem('token', data.token);
          this._redirigirPostLogin();
        } else {
          alert('Respuesta inesperada del servidor');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Error al iniciar sesión: ' + (err.message || 'Error'));
      } finally {
        this.loading = false;
      }
    },

    // Verificar 2FA
    async verificarCodigo() {
      if (!this.userId2FA) return alert('No hay sesión 2FA iniciada. Vuelve a hacer login.');
      if (!this.codigoIngresado || this.codigoIngresado.length < 4) return alert('Ingresa el código 2FA');

      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/users/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: this.userId2FA, code: this.codigoIngresado })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Código inválido');

        if (data.token) {
          localStorage.setItem('token', data.token);
          alert('Autenticado correctamente 🎉');
          this.resetAll();
          this._redirigirPostLogin();
        } else {
          alert('Autenticado, pero no se retornó token');
        }
      } catch (err) {
        console.error('Verify 2FA error:', err);
        alert('Error al verificar el código: ' + (err.message || 'Error'));
      } finally {
        this.loading = false;
      }
    },

    // Reenviar 2FA
    async reenviarCodigo() {
      if (!this.userId2FA) return alert('No hay sesión 2FA iniciada para reenviar.');
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/users/resend-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: this.userId2FA })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'No se pudo reenviar');

        this.mensaje = 'Se ha enviado un nuevo código 2FA.';
        alert('Se envió un nuevo código (revisa consola del servidor en dev).');
      } catch (err) {
        console.error('Resend 2FA error:', err);
        alert('Error al reenviar el código: ' + (err.message || 'Error'));
      } finally {
        this.loading = false;
      }
    },

    // Redirigir después del login
    _redirigirPostLogin() {
      try {
        const routeName = 'GestionPrestamos'; // ajusta si tu ruta tiene otro nombre
        if (this.$router && this.$router.getRoutes && this.$router.getRoutes().some(r => r.name === routeName)) {
          this.$router.push({ name: routeName });
          return;
        }
        // fallback a ListaLibros por nombre o a '/'
        if (this.$router && this.$router.getRoutes && this.$router.getRoutes().some(r => r.name === 'ListaLibros')) {
          this.$router.push({ name: 'ListaLibros' });
          return;
        }
        window.location.href = '/';
      } catch (e) {
        console.error('Error al redirigir post-login:', e);
        window.location.href = '/';
      }
    }
  }
};
</script>

<style src="../assets/paginaInicio.css"></style>


