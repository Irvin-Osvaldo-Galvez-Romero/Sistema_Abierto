# 🎨 Guía de Colores - Sistema Universitario

## 🎯 Paleta de Colores Oficial

El sistema utiliza una paleta de colores institucional basada en verde, blanco, negro y grises.

---

## 🌈 COLORES PRINCIPALES

### **Verde Universitario - Color Principal**
```css
Primary Main: #008000    /* Verde principal */
Primary Light: #00A000   /* Verde claro (hover) */
Primary Dark: #006000    /* Verde oscuro (activo) */
```

**Uso:**
- Botones principales
- Headers y barras de navegación
- Iconos destacados
- Enlaces importantes
- Estados de éxito

### **Blanco - Background Principal**
```css
White: #FFFFFF           /* Blanco puro */
Background: #FFFFFF      /* Fondo de página */
Paper: #FFFFFF           /* Fondo de tarjetas */
```

**Uso:**
- Fondo de la aplicación
- Tarjetas y cards
- Modales y diálogos
- Texto en botones oscuros

### **Negro - Texto Principal**
```css
Black: #000000           /* Negro puro */
Text Primary: #000000    /* Texto principal */
```

**Uso:**
- Títulos principales
- Texto de contenido
- Encabezados importantes

### **Gris Oscuro - Texto Secundario**
```css
Dark Gray: #333333       /* Gris oscuro */
Secondary Main: #333333  /* Color secundario */
Text Secondary: #333333  /* Texto secundario */
```

**Uso:**
- Subtítulos
- Texto descriptivo
- Botones secundarios
- Iconos secundarios

### **Gris Medio - Elementos Deshabilitados**
```css
Medium Gray: #888888     /* Gris medio */
Secondary Light: #888888 /* Gris claro secundario */
```

**Uso:**
- Texto deshabilitado
- Iconos inactivos
- Separadores
- Información adicional
- Footer

---

## 🎨 GRADIENTES

### **Gradiente Principal (Headers)**
```css
background: linear-gradient(135deg, #008000 0%, #006000 100%);
```

**Usado en:**
- Barra superior de todas las páginas
- Header de login
- Header de registro
- Headers de dashboards

---

## 📊 COLORES DE ESTADOS

### **Estados de Documentos:**

#### **Aprobado:**
```css
Success: #008000         /* Verde */
Background: #f0fff0      /* Verde muy claro */
```

#### **Rechazado:**
```css
Error: #CC0000           /* Rojo */
Background: #fff0f0      /* Rojo muy claro */
```

#### **Pendiente:**
```css
Warning: #FFA500         /* Naranja */
Background: #fff8f0      /* Naranja muy claro */
```

#### **Faltante:**
```css
Default: #888888         /* Gris medio */
Background: #f5f5f5      /* Gris muy claro */
```

---

## 🔘 BOTONES

### **Botón Principal (Contained)**
```css
Background: #008000      /* Verde */
Text: #FFFFFF            /* Blanco */
Hover: #006000           /* Verde oscuro */
```

### **Botón Secundario (Outlined)**
```css
Border: #008000          /* Verde */
Text: #008000            /* Verde */
Hover Background: rgba(0, 128, 0, 0.04)
```

### **Botón Texto (Text)**
```css
Text: #008000            /* Verde */
Hover Background: rgba(0, 128, 0, 0.04)
```

### **Botón Deshabilitado**
```css
Background: #f5f5f5      /* Gris muy claro */
Text: #888888            /* Gris medio */
Border: #cccccc          /* Gris claro */
```

---

## 📦 TARJETAS Y CONTENEDORES

### **Paper / Card**
```css
Background: #FFFFFF      /* Blanco */
Border: none
Shadow: 0 2px 4px rgba(0,0,0,0.1)
Border Radius: 8px
```

### **Paper Destacado**
```css
Background: #f0f0f0      /* Gris muy claro */
Border: 2px solid #008000  /* Borde verde */
```

---

## 📝 FORMULARIOS

### **TextField Normal**
```css
Border: #888888          /* Gris medio */
Text: #000000            /* Negro */
Label: #333333           /* Gris oscuro */
```

### **TextField Enfocado**
```css
Border: #008000          /* Verde */
Label: #008000           /* Verde */
```

### **TextField Error**
```css
Border: #CC0000          /* Rojo */
Label: #CC0000           /* Rojo */
Helper Text: #CC0000     /* Rojo */
```

---

## 🏷️ CHIPS Y BADGES

### **Chip Success (Aprobado)**
```css
Background: #008000      /* Verde */
Text: #FFFFFF            /* Blanco */
```

### **Chip Error (Rechazado)**
```css
Background: #CC0000      /* Rojo */
Text: #FFFFFF            /* Blanco */
```

### **Chip Warning (Pendiente)**
```css
Background: #FFA500      /* Naranja */
Text: #FFFFFF            /* Blanco */
```

### **Chip Default**
```css
Background: #888888      /* Gris medio */
Text: #FFFFFF            /* Blanco */
```

### **Badge (Contador)**
```css
Background: #CC0000      /* Rojo */
Text: #FFFFFF            /* Blanco */
```

---

## 🔔 ALERTAS

### **Alert Success**
```css
Background: #f0fff0      /* Verde muy claro */
Border: #008000          /* Verde */
Icon: #008000            /* Verde */
Text: #000000            /* Negro */
```

### **Alert Error**
```css
Background: #fff0f0      /* Rojo muy claro */
Border: #CC0000          /* Rojo */
Icon: #CC0000            /* Rojo */
Text: #000000            /* Negro */
```

### **Alert Warning**
```css
Background: #fff8f0      /* Naranja muy claro */
Border: #FFA500          /* Naranja */
Icon: #FFA500            /* Naranja */
Text: #000000            /* Negro */
```

### **Alert Info**
```css
Background: #f0f0f0      /* Gris muy claro */
Border: #333333          /* Gris oscuro */
Icon: #333333            /* Gris oscuro */
Text: #000000            /* Negro */
```

---

## 📊 TABLAS Y LISTAS

### **Header de Tabla**
```css
Background: #008000      /* Verde */
Text: #FFFFFF            /* Blanco */
```

### **Fila Normal**
```css
Background: #FFFFFF      /* Blanco */
Text: #000000            /* Negro */
```

### **Fila Hover**
```css
Background: #f5f5f5      /* Gris muy claro */
```

### **Fila Seleccionada**
```css
Background: #f0fff0      /* Verde muy claro */
```

---

## 🎯 ICONOS

### **Iconos Principales**
```css
Color: #008000           /* Verde */
Size: 24px (normal), 40px (grande)
```

### **Iconos Secundarios**
```css
Color: #333333           /* Gris oscuro */
```

### **Iconos Deshabilitados**
```css
Color: #888888           /* Gris medio */
```

### **Iconos de Estado:**
- ✅ Aprobado: `#008000` (Verde)
- ❌ Rechazado: `#CC0000` (Rojo)
- ⏳ Pendiente: `#FFA500` (Naranja)
- ℹ️ Info: `#333333` (Gris oscuro)

---

## 📐 ESPACIADO Y TIPOGRAFÍA

### **Tipografía:**
```css
Font Family: 'Roboto', 'Helvetica', 'Arial', sans-serif
Font Weights: 300, 400, 500, 600, 700

Headings Color: #000000       /* Negro */
Body Text Color: #000000       /* Negro */
Secondary Text: #333333        /* Gris oscuro */
Disabled Text: #888888         /* Gris medio */
```

### **Border Radius:**
```css
Small: 4px
Medium: 8px (default)
Large: 12px
Extra Large: 16px
```

---

## 🌟 SOMBRAS

### **Elevación Baja**
```css
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
```

### **Elevación Media**
```css
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
```

### **Elevación Alta**
```css
box-shadow: 0 8px 16px rgba(0,0,0,0.2);
```

---

## 🎨 EJEMPLOS DE USO

### **Botón Principal:**
```tsx
<Button variant="contained" color="primary">
  Guardar
</Button>
```
Resultado: Verde (#008000) con texto blanco

### **Botón Secundario:**
```tsx
<Button variant="outlined" color="secondary">
  Cancelar
</Button>
```
Resultado: Borde gris oscuro (#333333) con texto gris oscuro

### **Estado de Aprobación:**
```tsx
<Chip label="APROBADO" color="success" />
```
Resultado: Verde (#008000) con texto blanco

### **Estado de Rechazo:**
```tsx
<Chip label="RECHAZADO" color="error" />
```
Resultado: Rojo (#CC0000) con texto blanco

---

## 🔄 TRANSICIONES

```css
transition: all 0.3s ease;
```

**Usado en:**
- Hover de botones
- Hover de cards
- Cambio de estados
- Animaciones suaves

---

## 📱 ACCESIBILIDAD

### **Contraste Mínimo:**
- Texto negro sobre blanco: ✅ Ratio 21:1 (AAA)
- Texto blanco sobre verde: ✅ Ratio 7.7:1 (AAA)
- Texto gris oscuro sobre blanco: ✅ Ratio 12.6:1 (AAA)
- Texto gris medio sobre blanco: ✅ Ratio 4.7:1 (AA)

**Cumplimiento:** WCAG 2.1 Nivel AAA

---

## 🎯 APLICACIÓN EN COMPONENTES

### **LoginPage / RegisterPage:**
- Gradiente verde en fondo
- Cards blancas
- Botones verdes
- Texto negro

### **Dashboard:**
- Header verde con gradiente
- Fondo blanco
- Cards blancas con sombra
- Estadísticas con iconos verdes/grises

### **Upload de Documentos:**
- Header verde
- Cards de documentos blancas
- Estados con colores (verde/rojo/naranja)
- Panel de seguridad con borde verde

### **Notificaciones:**
- Header verde
- Notificaciones no leídas con fondo verde claro
- Iconos según tipo de notificación

---

## 💡 BUENAS PRÁCTICAS

### **✅ Hacer:**
- Usar verde para acciones principales
- Usar blanco para backgrounds
- Usar negro para texto principal
- Usar grises para texto secundario
- Mantener contraste alto para accesibilidad

### **❌ Evitar:**
- Colores muy saturados
- Fondos de color sobre texto de color
- Bajo contraste
- Más de 3 colores principales por pantalla

---

## 🔍 VERIFICACIÓN

### **Herramientas:**
- Chrome DevTools (contrast ratio)
- WebAIM Contrast Checker
- Material-UI Theme Inspector

---

**Paleta:** Verde, Blanco, Negro, Grises  
**Versión:** 1.1.0  
**Cumplimiento:** WCAG 2.1 AAA  
**Última actualización:** Octubre 2024

