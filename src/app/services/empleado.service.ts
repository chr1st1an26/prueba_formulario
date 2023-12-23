import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private empleados: any[] = [];
  private idCounter: number = 1;

  getEmpleados() {
    return this.empleados;
  }

  agregarEmpleado(empleado: any) {
    empleado.id = this.idCounter++;
    empleado.mostrarBotonEditar = empleado.estatus === 'activo';
    this.empleados.unshift(empleado);
    this.actualizarMostrarBotonEditar();
  }

  actualizarEdad(id: number, nuevaEdad: number) {
    const empleado = this.empleados.find((e) => e.id === id);
    if (empleado) {
      empleado.edad = nuevaEdad;
    }
  }

  actualizarEmpleado(id: number, nuevoEmpleado: any) {
    const index = this.empleados.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.empleados[index] = { ...this.empleados[index], ...nuevoEmpleado };
    }
  }

  cambiarEstatus(id: number) {
    const empleado = this.empleados.find((e) => e.id === id);
    if (empleado) {
      empleado.estatus = this.toggleEstatus(empleado.estatus);
      empleado.mostrarBotonEditar = empleado.estatus === 'activo';
    }
  }

  toggleEstatus(estatus: string): string {
    return estatus === 'activo' ? 'inactivo' : 'activo';
  }

  eliminarEmpleado(id: number): boolean {
    const index = this.empleados.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.empleados.splice(index, 1);
      return true;
    }
    return false;
  }

  private actualizarMostrarBotonEditar() {
    this.empleados.forEach((empleado) => {
      empleado.mostrarBotonEditar = empleado.estatus === 'activo';
    });
  }
}
