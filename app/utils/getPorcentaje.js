const limits = {
   peso: 150,
   imc: 50
}

export const getPorcentaje = (value, type) => {
   return `${value * 100 / limits[type]}%`
}