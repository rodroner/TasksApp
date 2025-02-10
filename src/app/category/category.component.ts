import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngModel
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Category } from './models/category.model';
import { CategoryService } from './services/category.service';
import { TaskService } from '../task/service/task.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ]

})
export class CategoryComponent {

  categoryList: Category[] = [];

  cat = {
    name: ""
  }

  idCatAux = "";

  showModal = false;

  showModalUpdate = false;

  constructor(
    private catService: CategoryService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.refreshCatList();
  }

  refreshCatList() {
    this.catService.getCategories().subscribe((data: Category[]) => {
      this.categoryList = data;
    });
  }

  onSubmit() {

    // Llama a createTask y se suscribe para insertar la tarea
    this.catService.createCategory(this.cat).subscribe(() => {
      Swal.fire({
        title: 'Categoría creada',
        text: 'La categoría "' + this.cat.name + '" ha sido creada exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alert alert-success',
          confirmButton: 'btn btn-primary'
        },
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        this.showModal = false;
        this.refreshCatList();

      });

      // Limpia los inputs del formulario
    });
  }

  deleteCategory(categoryId: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer. Todas las tareas asociadas perderán esta categoría.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'alert alert-warning',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizamos las tareas para quitar la categoría antes de eliminarla
        this.taskService.removeCategoryFromTasks(categoryId).subscribe({
          next: () => {
            console.log('Tareas con esa categoría han sido actualizadas');
          },
          error: (err) => {
            console.error('Error al actualizar las tareas:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron actualizar las tareas. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-danger',
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });

        // Ahora eliminamos la categoría
        this.catService.deleteCategory(categoryId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Categoría eliminada',
              text: 'La categoría ha sido eliminada exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-success',
                confirmButton: 'btn btn-primary',
              },
              timer: 2000,
              timerProgressBar: true,
            });

            this.refreshCatList();  // Recargamos la lista de categorías y tareas
          },
          error: (err) => {
            console.error('Error al eliminar la categoría:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la categoría. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                popup: 'alert alert-danger',
                confirmButton: 'btn btn-primary',
              },
            });
          },
        });
      }
    });
  }

  updateCategory(categoryId: string) {

    if (categoryId != undefined) {
      this.catService.updateCategory(categoryId, this.cat).subscribe(() => {
        Swal.fire({
          title: 'Categoría actualizada',
          text: `La categoría "${categoryId}" ha sido actualizada exitosamente a "${this.cat.name}"`,
          icon: 'info',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'alert alert-primary',
            confirmButton: 'btn btn-primary'
          },
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.hiddeModalUpdate();
          this.refreshCatList();
        });
      });
    }
  }

  showFormModal() {
    this.showModal = true;
  }

  hiddeModal() {
    this.showModal = false;
  }

  showFormModalUpdate(categoryId: string, categoryName: string) {
    this.showModalUpdate = true;
    this.idCatAux = categoryId;
    this.cat = {
      name: categoryName
    }
  }

  hiddeModalUpdate() {
    this.showModalUpdate = false;
    this.cat = {
      name: ""
    }
  }
}
