# Portal RH — Configuração do Supabase

## 1. Criar o Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e clique em **New Project**
2. Nome: `Portal`
3. Defina uma senha forte para o banco
4. Escolha a região mais próxima (ex: South America)

---

## 2. Copiar as Credenciais

Vá em: **Project Settings → API**

Copie e cole no arquivo `.env` do projeto:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  (token longo começando com eyJ)
```

---

## 3. Criar a Tabela `employees`

No painel do Supabase, vá em **SQL Editor** e execute:

```sql
-- Tabela de colaboradores
CREATE TABLE IF NOT EXISTS employees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url   text,
  name        text NOT NULL,
  role        text,
  level       text CHECK (level IN ('Junior','Pleno','Senior','Lead','Coordenador','Head','Gerente','Diretor')),
  team        text CHECK (team IN ('Design','Tecnologia','RH','Atendimento','Negócios')),
  bio         text,
  email       text,
  address     text,
  is_manager  boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 4. Habilitar Row Level Security (RLS)

```sql
-- Habilitar RLS na tabela
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para usuários autenticados
CREATE POLICY "Authenticated can read employees"
  ON employees FOR SELECT
  USING (auth.role() = 'authenticated');

-- Permitir insert para usuários autenticados
CREATE POLICY "Authenticated can insert employees"
  ON employees FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Permitir update para usuários autenticados
CREATE POLICY "Authenticated can update employees"
  ON employees FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Permitir delete para usuários autenticados
CREATE POLICY "Authenticated can delete employees"
  ON employees FOR DELETE
  USING (auth.role() = 'authenticated');
```

---

## 5. Configurar a URL de Redirecionamento (Recuperação de Senha)

Vá em: **Authentication → URL Configuration**

Em **Redirect URLs**, adicione:
```
http://localhost:5173/auth/reset-password
```

> ⚠️ Quando hospedar em produção, adicione também a URL de produção, ex:
> `https://seudominio.com/auth/reset-password`

---

## 6. (Opcional) Desabilitar confirmação de e-mail para testes

Vá em: **Authentication → Settings → Email Auth**

Desmarque **"Enable email confirmations"** para facilitar testes locais.

---

## 7. Dados de Exemplo (opcional)

```sql
INSERT INTO employees (name, role, level, team, bio, email, address, is_manager, photo_url) VALUES
  ('Ana Lima', 'Design Lead', 'Lead', 'Design', 'Designer com 8 anos de experiência em UX e produto.', 'ana.lima@empresa.com', 'São Paulo, SP', true, ''),
  ('Bruno Costa', 'UX Designer', 'Pleno', 'Design', 'Apaixonado por pesquisa com usuário e prototipagem.', 'bruno.costa@empresa.com', 'São Paulo, SP', false, ''),
  ('Carla Souza', 'Head de Tecnologia', 'Head', 'Tecnologia', 'Engenheira full-stack com foco em sistemas escaláveis.', 'carla.souza@empresa.com', 'Belo Horizonte, MG', true, ''),
  ('Diego Ferreira', 'Desenvolvedor Backend', 'Senior', 'Tecnologia', 'Especialista em Node.js e bancos de dados.', 'diego.f@empresa.com', 'Porto Alegre, RS', false, ''),
  ('Elena Martins', 'Gerente de RH', 'Gerente', 'RH', 'Responsável pela cultura organizacional e T&D.', 'elena.m@empresa.com', 'São Paulo, SP', true, ''),
  ('Felipe Rocha', 'Analista de Negócios', 'Pleno', 'Negócios', 'Foco em expansão de parceiros e estratégia.', 'felipe.r@empresa.com', 'Rio de Janeiro, RJ', false, ''),
  ('Gabriela Nunes', 'Head de Atendimento', 'Head', 'Atendimento', 'Liderando time de CX com foco em NPS.', 'gabi.n@empresa.com', 'Recife, PE', true, '');
```
