import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemCardComponent } from '../crud/item-card/item-card.component';

declare let $: any;

import {
  DragDropModule,
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { TaskService } from '../service/task.service';
import { Task } from '../models/task.model';
import { UserService } from '../../user/service/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    CdkDropListGroup, CdkDropList, CdkDrag,
    ItemCardComponent
  ]
})
export class BoardComponent {

  readonly taskStatuses: Task['process'][] = [
    'pending selection',
    'in progress',
    'pending validation',
    'done'
  ];

  tasksByStatus: {
    'pending selection': Task[],
    'in progress': Task[],
    'pending validation': Task[],
    'done': Task[]
  } = {
    'pending selection': [],
    'in progress': [],
    'pending validation': [],
    'done': []
  };

  tasksList: Task[] = [];

  hoveredStatus: Task['process'] | null = null;

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this.taskService.getTasks().subscribe((data: Task[]) => {
      this.tasksList = data;

      this.tasksByStatus = {
        'pending selection': this.tasksList.filter(t => t.process === 'pending selection'),
        'in progress': this.tasksList.filter(t => t.process === 'in progress'),
        'pending validation': this.tasksList.filter(t => t.process === 'pending validation'),
        'done': this.tasksList.filter(t => t.process === 'done')
      };
    });
  }

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) { }

  onProcessChanged(updatedTask: Task): void {
    this.getList();
  }

  drop(event: CdkDragDrop<any>) {
    const taskIdString = event.item.element.nativeElement.firstChild?.textContent;

    setTimeout(() => {
      const elementIdTask = $('.data-id-task:contains("'+taskIdString+'")');
      const newProccess = $(elementIdTask).parent().parent().parent().attr('data-process');

      if(taskIdString){
        this.taskService.getTaskById(taskIdString).subscribe({
          next: (selectedTask) => {
            if (selectedTask) {
              console.log(selectedTask.process);

              if(newProccess==null){
                selectedTask.process = "pending selection";
              }else{
                selectedTask.process = newProccess;
              }

              this.taskService.updateTask2(selectedTask).subscribe({
                next: (updatedTask) => {
                  console.log('Tarea actualizada correctamente:', updatedTask);
                  this.getList();

                },
                error: (error) => {
                  console.error('Error al actualizar la tarea:', error);
                }
              });

            } else {
              console.error('Tarea no encontrada');
            }
          },
          error: (error) => {
            console.error('Error al obtener la tarea:', error);
          }
        });
      }
    }, 500);

    if (event.previousContainer === event.container) {
      //Movemos la TASK sobre la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //Movemos la TASK sobre otra columna (CAMBIAMOS EL process)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
