// utils/pais-helper.js - Manejo de códigos de país por negocio
// ⚠️ NO MODIFICAR ESTE ARCHIVO SIN AUDITAR TODOS LOS ARCHIVOS QUE LO USAN

console.log('🌍 pais-helper.js cargado');

// Configuración de países por negocio (SOLO para excepciones)
// Por defecto, todos los negocios usan +53 (Cuba)
const PAISES_POR_NEGOCIO = {
    // Nail's YEY93 (USA)
    'affa3b9a-8a2c-4e82-a251-1cdcaaf2de75': {
        codigo: '1',
        formato: '+1',
        digitos: 10  // USA: 10 dígitos después del código
    }
    // Para agregar otro negocio con diferente país, agregar aquí
};

// Función para obtener el código de país de un negocio
window.getCodigoPais = function(negocioId) {
    // Si el negocio tiene configuración especial, usarla
    if (PAISES_POR_NEGOCIO[negocioId]) {
        return PAISES_POR_NEGOCIO[negocioId].codigo;
    }
    // Por defecto, Cuba (+53)
    return '53';
};

// Función para obtener el formato +XX para mostrar en UI
window.getFormatoPais = function(negocioId) {
    const codigo = window.getCodigoPais(negocioId);
    return `+${codigo}`;
};

// Función para obtener la cantidad de dígitos esperada
window.getDigitosEsperados = function(negocioId) {
    if (PAISES_POR_NEGOCIO[negocioId]) {
        return PAISES_POR_NEGOCIO[negocioId].digitos;
    }
    return 8; // Cuba: 8 dígitos
};

// 🔥 FUNCIÓN CLAVE: Formatea un número para guardar en BD
// INPUT: número ingresado por usuario (ej: 5043456728 o 15043456728)
// OUTPUT: número con código de país (ej: 15043456728)
window.formatearNumeroParaBD = function(numeroRaw, negocioId) {
    const codigoPais = window.getCodigoPais(negocioId);
    let numeroLimpio = numeroRaw.toString().replace(/\D/g, '');
    
    // Si ya tiene el código de país al inicio, no duplicar
    if (numeroLimpio.startsWith(codigoPais)) {
        return numeroLimpio;
    }
    
    // Si el código es 1 y el número empieza con 1 (caso USA)
    if (codigoPais === '1' && numeroLimpio.startsWith('1')) {
        return numeroLimpio;
    }
    
    // Si no, agregar el código
    return codigoPais + numeroLimpio;
};

// 🔥 FUNCIÓN CLAVE: Formatea un número para mostrar en UI
// INPUT: número de BD (ej: 15043456728)
// OUTPUT: número formateado para mostrar (ej: +1 5043456728)
window.formatearNumeroParaUI = function(numeroBD, negocioId) {
    const codigoPais = window.getCodigoPais(negocioId);
    const formato = window.getFormatoPais(negocioId);
    let numeroLimpio = numeroBD.toString().replace(/\D/g, '');
    
    // Remover el código de país si está al inicio
    if (numeroLimpio.startsWith(codigoPais)) {
        numeroLimpio = numeroLimpio.substring(codigoPais.length);
    }
    
    return `${formato} ${numeroLimpio}`;
};

// 🔥 FUNCIÓN CLAVE: Obtener el negocio_id actual (unificada)
window.getNegocioIdActual = function() {
    // Prioridad: localStorage (sesión actual) -> variable global -> null
    const localId = localStorage.getItem('negocioId');
    if (localId) return localId;
    
    if (window.NEGOCIO_ID_POR_DEFECTO) return window.NEGOCIO_ID_POR_DEFECTO;
    
    if (typeof window.getNegocioId === 'function') return window.getNegocioId();
    
    console.error('❌ No se pudo obtener negocioId');
    return null;
};

console.log('✅ pais-helper.js listo - Negocio USA configurado:', PAISES_POR_NEGOCIO);