export interface Task {

  id: string;

  name: string;

  //id de Usuario asignado
  assigned: string;

  //id de Category asignada
  hasCategory: string;

  //id de Sprint asignado
  hasSprint: string;

  //id´s de las Task hijas (solo si tiene categoria==EPIC)
  hasTaskChild: string[];

  //Dificultad de tarea 0 a 5
  difficulty: number;

  //Proceso de tarea, por defecto 'pendiente de seleccionar'
  process: 'pending selection' | 'in progress' | 'pending validation' | 'done';
}
