# 🏫 CARRERAS DEL TECNOLÓGICO DE ESTUDIOS SUPERIORES DE CHIMALHUACÁN (TESCHI)

## ✅ **CARRERAS OFICIALES IMPLEMENTADAS**

El sistema ahora incluye únicamente las **7 carreras oficiales** que ofrece el **Tecnológico de Estudios Superiores de Chimalhuacán**.

---

## 🎓 **OFERTA EDUCATIVA DEL TESCHI**

### 📐 **Ingenierías (5 carreras)**

| **Clave** | **Nombre Completo** | **Duración** | **Créditos** |
|-----------|---------------------|--------------|--------------|
| **ISC** | Ingeniería en Sistemas Computacionales | 9 semestres | 300 créditos |
| **II** | Ingeniería Industrial | 9 semestres | 300 créditos |
| **IQ** | Ingeniería Química | 9 semestres | 300 créditos |
| **IMT** | Ingeniería Mecatrónica | 9 semestres | 300 créditos |
| **IADEV** | Ingeniería en Animación Digital y Efectos Visuales | 9 semestres | 300 créditos |

#### Descripción de las Ingenierías:

**🖥️ Ingeniería en Sistemas Computacionales (ISC)**
- Formación de profesionales capaces de diseñar, desarrollar e implementar sistemas computacionales innovadores

**🏭 Ingeniería Industrial (II)**
- Formación de profesionales en la optimización de sistemas productivos, logística y calidad

**⚗️ Ingeniería Química (IQ)**
- Formación de profesionales en procesos químicos, control de calidad y desarrollo sustentable

**🤖 Ingeniería Mecatrónica (IMT)**
- Formación de profesionales en sistemas automatizados, robótica y control de procesos industriales

**🎨 Ingeniería en Animación Digital y Efectos Visuales (IADEV)**
- Formación de profesionales en diseño, animación 2D/3D, efectos visuales y producción multimedia

---

### 🎯 **Licenciaturas (2 carreras)**

| **Clave** | **Nombre Completo** | **Duración** | **Créditos** |
|-----------|---------------------|--------------|--------------|
| **LA** | Licenciatura en Administración | 8 semestres | 280 créditos |
| **LG** | Licenciatura en Gastronomía | 8 semestres | 280 créditos |

#### Descripción de las Licenciaturas:

**💼 Licenciatura en Administración (LA)**
- Formación de profesionales en gestión empresarial, recursos humanos y dirección estratégica

**🍳 Licenciatura en Gastronomía (LG)**
- Formación de profesionales en artes culinarias, administración gastronómica y cultura alimentaria

---

## 📊 **RESUMEN DE IMPLEMENTACIÓN**

```
✅ 7 carreras del TESCHI insertadas
❌ 10 carreras genéricas eliminadas
📋 Total: 7 carreras oficiales disponibles
🏫 Institución: Tecnológico de Estudios Superiores de Chimalhuacán
```

---

## 🔍 **CÓMO VERIFICAR**

### **En el Formulario de Alta de Estudiante**

Cuando accedas a:
```
http://localhost:3000/admin/estudiantes/nuevo
```

El selector de **"Carrera *"** ahora mostrará únicamente:

```
┌─────────────────────────────────────────────────────────┐
│ Carrera *                                        ▼      │
├─────────────────────────────────────────────────────────┤
│ 📐 INGENIERÍAS:                                         │
│   • Ingeniería en Animación Digital y Efectos... (IADEV)│
│   • Ingeniería en Sistemas Computacionales (ISC)       │
│   • Ingeniería Industrial (II)                         │
│   • Ingeniería Mecatrónica (IMT)                       │
│   • Ingeniería Química (IQ)                            │
│                                                         │
│ 🎯 LICENCIATURAS:                                       │
│   • Licenciatura en Administración (LA)                │
│   • Licenciatura en Gastronomía (LG)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ **SCRIPTS UTILIZADOS**

### Script de Actualización
```bash
cd proyecto/backend
npx tsx scripts/limpiar-e-insertar-carreras-teschi.ts
```

**Este script:**
1. ✅ Elimina todas las carreras genéricas anteriores
2. ✅ Inserta únicamente las 7 carreras oficiales del TESCHI
3. ✅ Verifica que todo se haya actualizado correctamente

### Archivos Creados/Modificados
```
proyecto/
├── backend/
│   └── scripts/
│       ├── seed-carreras.ts                            ✅ Actualizado con carreras TESCHI
│       └── limpiar-e-insertar-carreras-teschi.ts      ✅ Nuevo script de actualización
└── CARRERAS_TESCHI.md                                  ✅ Este documento
```

---

## 🎯 **CARRERAS POR ÁREA DE CONOCIMIENTO**

### **Área de Tecnología de la Información**
- Ingeniería en Sistemas Computacionales (ISC)
- Ingeniería en Animación Digital y Efectos Visuales (IADEV)

### **Área de Ingeniería**
- Ingeniería Industrial (II)
- Ingeniería Química (IQ)
- Ingeniería Mecatrónica (IMT)

### **Área Económico-Administrativa**
- Licenciatura en Administración (LA)

### **Área de Servicios**
- Licenciatura en Gastronomía (LG)

---

## 📍 **INFORMACIÓN DEL TESCHI**

**🏫 Nombre Completo:**
Tecnológico de Estudios Superiores de Chimalhuacán

**📍 Ubicación:**
Chimalhuacán, Estado de México

**📚 Tipo de Institución:**
Instituto Tecnológico de Estudios Superiores

**🎓 Carreras Ofertadas:**
- 5 Ingenierías
- 2 Licenciaturas
- **Total: 7 programas educativos**

---

## ✅ **ESTADO ACTUAL DEL SISTEMA**

```
✅ Carreras del TESCHI implementadas
✅ Carreras genéricas eliminadas
✅ Selector de carreras actualizado
✅ Formularios funcionando correctamente
✅ Validaciones actualizadas
✅ Base de datos sincronizada
✅ Sistema 100% operativo con carreras oficiales
```

---

## 🎉 **SISTEMA PERSONALIZADO PARA EL TESCHI**

El sistema ahora está **completamente personalizado** para el Tecnológico de Estudios Superiores de Chimalhuacán, incluyendo únicamente las carreras que realmente se ofrecen en la institución.

**Características:**
- ✅ Solo carreras oficiales del TESCHI
- ✅ Claves de carrera específicas
- ✅ Descripciones acordes a cada programa
- ✅ Duración y créditos correctos
- ✅ Modalidad presencial
- ✅ Listo para producción

---

## 📝 **NOTA IMPORTANTE**

Si el TESCHI llegara a agregar o modificar carreras en el futuro, puedes:

1. Editar el archivo: `proyecto/backend/scripts/seed-carreras.ts`
2. Agregar o modificar las carreras en el array
3. Ejecutar nuevamente el script:
   ```bash
   cd proyecto/backend
   npx tsx scripts/limpiar-e-insertar-carreras-teschi.ts
   ```

---

**¡Sistema actualizado con las carreras oficiales del TESCHI! 🏫✨**


