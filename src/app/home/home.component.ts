import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../services/empleado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  empleadoForm!: FormGroup;
  edicionForm!: FormGroup;
  empleados: any[] = [];
  empleadoSeleccionado: any | null = null;
  searchText: string = '';

  constructor(private fb: FormBuilder, private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      cargo: ['', Validators.required],
      estatus: ['activo'],
    });

    this.edicionForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      cargo: ['', Validators.required],
      estatus: ['activo'],
    });

    this.empleados = this.empleadoService.getEmpleados();


    this.empleados.forEach(empleado => {
      empleado.nuevaEdad = empleado.edad;
      empleado.editandoEdad = false;
    });
  }

  onSubmit() {
    if (this.empleadoForm && this.empleadoForm.valid) {
      const empleadoData = this.empleadoForm.value;
      this.empleadoService.agregarEmpleado(empleadoData);
      this.actualizarListaEmpleados();
      this.empleadoForm.reset({
        estatus: 'activo',
      });
    } else {
      alert('Por favor, rellena la información.');
    }
  }

  actualizarEdad(id: number, nuevaEdad: number) {
    this.empleadoService.actualizarEdad(id, nuevaEdad);
    this.actualizarListaEmpleados();
  }

  editarInformacion(empleado: any) {
    this.empleadoSeleccionado = empleado;
    this.edicionForm.setValue({
      nombreCompleto: empleado.nombreCompleto,
      fechaNacimiento: empleado.fechaNacimiento,
      edad: empleado.edad,
      cargo: empleado.cargo,
      estatus: empleado.estatus,
    });
  }

  cancelarEdicion() {
    this.ocultarCamposEdicion();
  }

  guardarEdicion() {
    if (this.edicionForm && this.edicionForm.valid && this.empleadoSeleccionado) {
      const empleadoData = this.edicionForm.value;
      this.empleadoService.actualizarEmpleado(this.empleadoSeleccionado.id, empleadoData);
      this.actualizarListaEmpleados();
      this.ocultarCamposEdicion();
    } else {
      alert('Por favor, rellena la información.');
    }
  }

  cambiarEstatus(id: number) {
    this.empleadoService.cambiarEstatus(id);
    this.actualizarListaEmpleados();
    this.ocultarCamposEdicion();
  }

  eliminarEmpleado(id: number) {
    this.empleadoService.eliminarEmpleado(id);
    this.actualizarListaEmpleados();

    if (this.empleadoSeleccionado && this.empleadoSeleccionado.id === id) {
      this.ocultarCamposEdicion();
    }
  }

  toggleEstatus(estatus: string): string {
    return estatus === 'activo' ? 'inactivo' : 'activo';
  }

  puedeEditar(estatus: string): boolean {
    return estatus === 'inactivo';
  }

  cumpleCriterio(empleado: any): boolean {
    if (!this.searchText) {
      return true;
    }

    const terminoBusqueda = this.searchText.toLowerCase();

    return (
      empleado.id.toString().includes(terminoBusqueda) ||
      empleado.nombreCompleto.toLowerCase().includes(terminoBusqueda) ||
      empleado.edad.toString().includes(terminoBusqueda) ||
      empleado.cargo.toLowerCase().includes(terminoBusqueda)
    );
  }

  private actualizarListaEmpleados() {
    this.empleados = this.empleadoService.getEmpleados();
  }

  private ocultarCamposEdicion() {
    this.empleadoSeleccionado = null;
    this.edicionForm.reset();
  }

  toggleEdicionEdad(empleado: any) {
    empleado.editandoEdad = !empleado.editandoEdad;

    if (!empleado.editandoEdad) {
      this.empleadoService.actualizarEdad(empleado.id, empleado.nuevaEdad);
      this.actualizarListaEmpleados();
    }
  }
}
