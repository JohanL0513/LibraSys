<template>
  <div class="verificacion">
    <h2>Verificación en dos pasos 🔐</h2>
    <p>Ingresa el código de 6 dígitos enviado a tu correo.</p>

    <form @submit.prevent="verificarCodigo">
      <input
        v-model="codigoIngresado"
        maxlength="6"
        placeholder="Código 2FA"
        class="campo"
      />
      <button type="submit" class="btn-primario">Verificar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "Verificacion2FA",
  data() {
    return {
      codigoIngresado: "",
      codigoCorrecto: "123456", // 👈 Código simulado, en un backend real se enviaría por correo o SMS
      error: ""
    };
  },
  methods: {
    verificarCodigo() {
      if (this.codigoIngresado === this.codigoCorrecto) {
        this.$router.push({ name: "ListaLibros" });
      } else {
        this.error = "❌ Código incorrecto. Intenta de nuevo.";
      }
    }
  }
};
</script>

<style scoped>
.verificacion {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d1b2a, #1b263b, #415a77);
  color: white;
  text-align: center;
  padding: 2rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #4fc3f7;
}

p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

form {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.campo {
  padding: 0.8rem;
  border: 1px solid #4fc3f7;
  border-radius: 8px;
  background-color: #1b263b;
  color: white;
  font-size: 1rem;
  text-align: center;
  outline: none;
  transition: border 0.3s;
}

.campo:focus {
  border-color: #90e0ef;
}

.btn-primario {
  background-color: #4fc3f7;
  color: #0d1b2a;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primario:hover {
  background-color: #90e0ef;
}

.error {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
