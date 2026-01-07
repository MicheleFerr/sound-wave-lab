# Guida: Applicare Migration Order Management System

## Metodo 1: Supabase Dashboard (Consigliato)

1. **Accedi a Supabase Dashboard**
   - Vai su https://supabase.com/dashboard
   - Seleziona il progetto "sound-wave-lab"

2. **Apri SQL Editor**
   - Menu laterale → "SQL Editor"
   - Click su "New query"

3. **Copia e Incolla Migration**
   - Apri il file: `supabase/migrations/20260107_order_notes_and_activity.sql`
   - Copia tutto il contenuto
   - Incolla nell'editor SQL

4. **Esegui Migration**
   - Click su "Run" (o Ctrl+Enter)
   - Verifica che non ci siano errori

5. **Verifica Tabelle Create**
   - Menu laterale → "Table Editor"
   - Cerca tabelle:
     - `order_notes`
     - `order_activity_log`
   - Verifica che esistano e abbiano le colonne corrette

---

## Metodo 2: Supabase CLI (Avanzato)

### Prerequisiti
```bash
# Installa Supabase CLI
npm install -g supabase

# Login
supabase login
```

### Collegare Progetto
```bash
# Nella root del progetto
supabase link --project-ref <YOUR_PROJECT_REF>
```

Il `project-ref` si trova in:
- Dashboard → Settings → General → Reference ID

### Applicare Migration
```bash
# Push migration a production
supabase db push
```

---

## Verifica Post-Migration

Dopo aver applicato la migration, verifica che:

### 1. Tabelle Create
```sql
-- Nel SQL Editor, esegui:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('order_notes', 'order_activity_log');
```

**Output atteso**: 2 righe con i nomi delle tabelle

---

### 2. Policies RLS Attive
```sql
-- Verifica policies su order_notes
SELECT * FROM pg_policies WHERE tablename = 'order_notes';

-- Verifica policies su order_activity_log
SELECT * FROM pg_policies WHERE tablename = 'order_activity_log';
```

**Output atteso**:
- `order_notes`: 5 policies (SELECT admin, SELECT customer, INSERT, UPDATE, DELETE)
- `order_activity_log`: 3 policies (SELECT admin, SELECT customer, INSERT)

---

### 3. Test Funzionalità

1. **Vai su Admin → Ordini → [Dettaglio Ordine]**
2. **Verifica che appaiano**:
   - Dropdown status funzionante
   - Sezione "Note ordine" con tab Interne/Cliente
   - Sezione "Cronologia attività"

3. **Test cambio status**:
   - Cambia lo status di un ordine
   - Verifica che appaia nella cronologia

4. **Test aggiunta nota**:
   - Aggiungi una nota interna
   - Verifica che appaia nella lista note

---

## Rollback (Se necessario)

Se qualcosa va storto, puoi fare rollback:

```sql
-- Rimuovi tabelle create
DROP TABLE IF EXISTS order_activity_log CASCADE;
DROP TABLE IF EXISTS order_notes CASCADE;

-- Rimuovi trigger
DROP TRIGGER IF EXISTS order_notes_updated_at ON order_notes;
DROP FUNCTION IF EXISTS update_order_notes_updated_at();
```

**ATTENZIONE**: Questo cancellerà tutti i dati nelle tabelle!

---

## Troubleshooting

### Errore: "relation already exists"
La migration è già stata applicata. Verifica con:
```sql
SELECT * FROM order_notes LIMIT 1;
```
Se funziona, la migration è già attiva.

---

### Errore: "permission denied"
Verifica di avere i permessi di admin su Supabase.
Contatta il proprietario del progetto.

---

### Errore: "syntax error"
Verifica di aver copiato TUTTO il contenuto del file migration, includendo commenti.

---

## Note Importanti

⚠️ **Backup**: Supabase fa backup automatici, ma per sicurezza:
```bash
# Esporta schema corrente prima di applicare
supabase db dump --schema public > backup-schema.sql
```

✅ **Dopo la migration**:
- Il sistema order management sarà completamente funzionante
- Non sono richieste altre modifiche al codice
- Deploy automatico su Vercel detecterà i nuovi endpoint API

---

## Support

In caso di problemi:
1. Verifica logs Supabase: Dashboard → Logs
2. Controlla errori API: Vercel Dashboard → Functions → Logs
3. Testa endpoints manualmente con curl o Postman

File migration: `supabase/migrations/20260107_order_notes_and_activity.sql`
Documentazione completa: `docs/ORDER_MANAGEMENT_SYSTEM.md`
