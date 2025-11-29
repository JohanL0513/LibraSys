export default {
  data() {
    return {
      vista: 'login',
      email: '',
      password: '',
      codigoGenerado: '',
      codigoIngresado: '',
      paso: 'login' // login → verificar
    }
  },
  methods: {
    // Enviar login y generar código
    enviarLogin() {
      if (!this.email || !this.password) {
        alert('Por favor, completa todos los campos.')
        return
      }

      // Generar código aleatorio de 6 dígitos
      this.codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString()

      // Mostrar el código al usuario (simulando envío por correo)
      alert(`Tu código de verificación es: ${this.codigoGenerado}`)

      // Pasar al paso de verificación
      this.paso = 'verificar'
    },

    // Verificar código ingresado
    verificarCodigo() {
      if (this.codigoIngresado === this.codigoGenerado) {
        alert('✅ Verificación exitosa. Bienvenido a LibraSys!')
        this.$router.push('/libros')
      } else {
        alert('❌ Código incorrecto. Intenta de nuevo.')
      }
    },

    // Registro (opcional)
    enviarRegistro() {
      alert('Registro completado correctamente (simulado)')
      this.vista = 'login'
    }
  }
}
