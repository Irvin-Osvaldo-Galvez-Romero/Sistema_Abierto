# Formato Excel para Importar Convenios

## Estructura del Archivo Excel

El archivo Excel debe tener las siguientes columnas en la primera hoja:

| Columna | Requerido | Descripción | Ejemplo |
|---------|-----------|-------------|---------|
| nombreEmpresa | ✅ Sí | Nombre de la empresa | "Empresa ABC S.A. de C.V." |
| razonSocial | ❌ No | Razón social completa | "Empresa ABC Sociedad Anónima de Capital Variable" |
| contacto | ❌ No | Nombre del contacto | "Juan Pérez" |
| email | ❌ No | Email de contacto | "contacto@empresa.com" |
| telefono | ❌ No | Teléfono de contacto | "5551234567" |
| direccion | ❌ No | Dirección de la empresa | "Av. Principal 123, Col. Centro" |
| sector | ❌ No | Sector de la empresa | "Tecnología" |
| fechaInicio | ❌ No | Fecha de inicio del convenio | "2025-01-15" o "15/01/2025" |
| fechaFin | ❌ No | Fecha de fin del convenio | "2025-12-31" o "31/12/2025" |
| descripcion | ❌ No | Descripción del convenio | "Convenio para prácticas profesionales" |
| condiciones | ❌ No | Condiciones del convenio | "Mínimo 6 meses, horario flexible" |
| urlConvenio | ❌ No | URL del documento del convenio | "https://onedrive.com/..." |
| qrCode | ❌ No | URL del código QR | "https://qr.com/..." |

## Ejemplo de Archivo Excel

```
nombreEmpresa          | razonSocial                    | contacto    | email              | telefono   | sector      | fechaInicio | fechaFin   | descripcion
-----------------------|--------------------------------|-------------|--------------------|------------|-------------|-------------|------------|----------------------------
Empresa ABC S.A.       | Empresa ABC S.A. de C.V.       | Juan Pérez  | juan@empresa.com   | 5551234567 | Tecnología  | 2025-01-15  | 2025-12-31 | Convenio para prácticas
Empresa XYZ            | Empresa XYZ S.A.               | María López | maria@xyz.com      | 5559876543 | Manufactura | 2025-02-01  | 2025-12-31 | Convenio de estadías
```

## Instrucciones

1. **Crear el archivo Excel**:
   - Abre Excel o Google Sheets
   - Crea una nueva hoja
   - Agrega los encabezados en la primera fila (exactamente como se muestran arriba)
   - Llena los datos en las filas siguientes

2. **Formato de fechas**:
   - Puedes usar formato: `YYYY-MM-DD` (ej: 2025-01-15)
   - O formato: `DD/MM/YYYY` (ej: 15/01/2025)
   - El sistema intentará parsear automáticamente

3. **Campos requeridos**:
   - Solo `nombreEmpresa` es obligatorio
   - Todos los demás campos son opcionales

4. **Importar**:
   - Ve a la página de administración de Modelo Dual
   - Pestaña "Convenios"
   - Haz clic en "Importar desde Excel"
   - Selecciona tu archivo Excel
   - Espera a que se procese

## Validaciones

- El archivo debe ser `.xls` o `.xlsx`
- La primera fila debe contener los encabezados
- Cada fila debe tener al menos `nombreEmpresa`
- Las fechas deben estar en formato válido
- Los emails deben tener formato válido (si se proporcionan)

## Errores Comunes

- **"El archivo Excel está vacío"**: Asegúrate de que hay datos después de los encabezados
- **"El nombre de la empresa es requerido"**: Verifica que la columna `nombreEmpresa` tenga datos
- **"Error al procesar el archivo Excel"**: Verifica que el formato del archivo sea correcto

## Notas

- Si hay errores en algunas filas, se crearán los convenios válidos y se reportarán los errores
- El sistema mostrará cuántos convenios se importaron exitosamente
- Los errores se mostrarán en la consola del navegador (F12)

