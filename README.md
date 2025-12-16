# Trasteros Portal Cliente

Portal de cliente móvil-first para gestión de alquiler de trasteros, construido con React, Tailwind y Supabase.

## Requisitos Previos

1.  Node.js v18+
2.  Proyecto Supabase activo
3.  Cuenta de Stripe (para pagos)

## Configuración del Entorno

Crea un archivo `.env` en la raíz (para desarrollo local):

```
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-anon-key-publica
```

## Instalación y Ejecución

```bash
npm install
npm start
```

## Estructura de Base de Datos (Supabase)

Se espera que existan o se creen las siguientes tablas. Asegúrate de habilitar RLS.

1.  `units`: Trasteros disponibles.
    *   `id` (uuid), `name` (text), `size_m2` (numeric), `price_monthly` (numeric), `status` (text), `location` (text), `features` (text[]), `image_url` (text)
2.  `contracts`: Relación usuario-trastero.
    *   `id` (uuid), `user_id` (uuid references auth.users), `unit_id` (uuid references units), `start_date` (date), `status` (text), `next_renewal_date` (date)
3.  `payments`: Registro histórico de pagos.
4.  `invoices_cache`: Copia ligera de facturas para listado rápido.

## Edge Functions Requeridas

Este frontend asume la existencia de las siguientes Supabase Edge Functions para mantener la lógica de negocio segura y fuera del navegador:

1.  `create-checkout-session`:
    *   Input: `unit_id`, `price_id`
    *   Logic: Valida disponibilidad, crea sesión Stripe Checkout.
    *   Output: `{ url: string }`
2.  `create-customer-portal-session`:
    *   Input: `return_url`
    *   Logic: Crea sesión de portal de cliente Stripe.
    *   Output: `{ url: string }`
3.  `webhook-stripe`:
    *   Debe escuchar eventos `checkout.session.completed` y `invoice.payment_succeeded` para actualizar las tablas `contracts`, `units` y `payments` en Supabase.

## Seguridad

*   Toda la lógica de escritura sensible (crear contrato, marcar pagado) debe ocurrir vía Webhooks o Edge Functions con `service_role`.
*   Las políticas RLS deben configurarse para que los usuarios solo puedan ver sus propios contratos y facturas.