import { supabase } from './supabase';

const TABLE = 'employees';

/** Busca todos os colaboradores, com filtros opcionais */
export async function getEmployees({ search = '', team = '', level = '' } = {}) {
  let query = supabase.from(TABLE).select('*').order('name');

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,role.ilike.%${search}%,email.ilike.%${search}%`
    );
  }
  if (team) query = query.eq('team', team);
  if (level) query = query.eq('level', level);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Busca um colaborador por ID */
export async function getEmployee(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/** Cria um novo colaborador */
export async function createEmployee(employee) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([employee])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Atualiza um colaborador */
export async function updateEmployee(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Exclui um colaborador */
export async function deleteEmployee(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/** Busca colaboradores agrupados por time, com gestores */
export async function getTeams() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('name');
  if (error) throw error;

  const teams = {};
  const teamOrder = ['Design', 'Tecnologia', 'RH', 'Atendimento', 'Negócios'];

  (data || []).forEach((emp) => {
    if (!teams[emp.team]) {
      teams[emp.team] = { name: emp.team, members: [], manager: null };
    }
    if (emp.is_manager) {
      teams[emp.team].manager = emp;
    } else {
      teams[emp.team].members.push(emp);
    }
  });

  return teamOrder
    .filter((t) => teams[t])
    .map((t) => teams[t]);
}
