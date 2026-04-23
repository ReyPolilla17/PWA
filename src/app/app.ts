import { Component, afterNextRender } from '@angular/core';  
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { AppService } from './app.service';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface pendiente {
  desc:string;
  materia:string;
  entrega:Date;
};

interface entregada {
  desc:string;
  materia:string;
  entrega:Date;
  entregada:Date;
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    FormsModule, 
    ButtonModule, 
    OrderListModule, 
    FloatLabelModule, 
    DatePickerModule, 
    InputTextModule,
    TooltipModule,
    TagModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private STORAGE_PENDIENTES:string = "tareas-pendientes"
  private STORAGE_ENTREGADAS:string = "tareas-terminadas"

  valid = true

  curdate = new Date()

  tareas_pendientes:pendiente[] = []
  tareas_terminadas:entregada[] = []

  addForm = new FormGroup({
    materia: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
    entrega: new FormControl(null, Validators.required)
  });

  pikachu:any = {}
  showPikachu:boolean = false

  constructor(private service:AppService) {}

  ngOnInit():void {
    this.getImagen()
    this.tareas_pendientes = this.getAllPendientes()
    this.tareas_terminadas = this.getAllEntregadas()
  }

  terminar(tarea:pendiente) {
    const terminada:entregada = {
      desc: tarea.desc,
      entrega: tarea.entrega,
      entregada: new Date(),
      materia: tarea.materia
    };

    const copia:entregada[] = [...this.tareas_terminadas]

    this.tareas_pendientes = this.tareas_pendientes.filter(t => t !== tarea)
    
    copia.push(terminada)
    
    this.tareas_terminadas = copia
    this.storeNewEntregada(terminada);

    localStorage.setItem(this.STORAGE_PENDIENTES, JSON.stringify(this.tareas_pendientes))
  }

  agregar() {
    // Extrae la información del formulario    
    const materia = this.addForm.get('materia')?.value
    const desc = this.addForm.get('desc')?.value
    const entrega = this.addForm.get('entrega')?.value

    const copia:pendiente[] = [...this.tareas_pendientes]
    
    // Si el formulario no es válido, no hace nada
    if (!this.addForm.valid) {
      this.valid = false
      return
    }

    const tarea = {desc:desc!, entrega:entrega!, materia:materia!}

    copia.push(tarea)
    
    this.tareas_pendientes = copia
    this.valid = true

    this.addForm.reset()

    this.storeNewPendiente(tarea)
  }

  getImagen() {
    this.service.getPokemoData().subscribe((res:any) => {
      this.pikachu = res.sprites.front_default
      this.showPikachu = true
    })
  }

  storeNewPendiente(tarea:pendiente) {
    const data:pendiente[] = this.getAllPendientes();

    data.push(tarea)
    
    localStorage.setItem(this.STORAGE_PENDIENTES, JSON.stringify(data))
  }
  
  storeNewEntregada(tarea:entregada) {
    const data:entregada[] = this.getAllEntregadas();

    data.push(tarea)
    
    localStorage.setItem(this.STORAGE_ENTREGADAS, JSON.stringify(data))
  }

  getAllPendientes():pendiente[] {
    const data = localStorage.getItem(this.STORAGE_PENDIENTES)
    const pendientes = data ? JSON.parse(data) : []

    for(const pendiente of pendientes) {
      pendiente.entrega = new Date(Date.parse(pendiente.entrega))
    }

    return pendientes;
  }
  
  getAllEntregadas():entregada[] {
    const data = localStorage.getItem(this.STORAGE_ENTREGADAS)
    const entregadas = data ? JSON.parse(data) : []

    for(const entregada of entregadas) {
      entregada.entrega = new Date(Date.parse(entregada.entrega))
      entregada.entregada = new Date(Date.parse(entregada.entregada))
    }

    return entregadas;
  }

  eliminarPendiente(tarea:pendiente) {
    this.tareas_pendientes = this.tareas_pendientes.filter(t => t !== tarea)

    localStorage.setItem(this.STORAGE_PENDIENTES, JSON.stringify(this.tareas_pendientes))
  }
  
  eliminarEntregada(tarea:entregada) {
    this.tareas_terminadas = this.tareas_terminadas.filter(t => t !== tarea)

    localStorage.setItem(this.STORAGE_ENTREGADAS, JSON.stringify(this.tareas_terminadas))
  }
}