import React from 'react';
import './App.css';
import { PersonaService } from './service/PersonaService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';


import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class App extends React.Component {

  constructor(props) {
    super(props)

    //Seteamos las variables de estado.
    this.state = {
      personas: [],           // Contendrá el arreglo de personas
      visible: false,         // Utilizado para mostrar cuadro de diálogo
      persona: {},            // Contendrá solo una persona
      selectedPersona: {}     // Contendrá solo a la persona que sea seleccionada de la lista. 
    }

    this.personaService = new PersonaService();

    // Botones a mostrar en el menú bar.
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => { this.showSaveDialog() }
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => { this.showEditDialog() }
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => { this.delete() }
      }
    ];

    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);

    this.footer = (
      <div>
        <Button label="Guardar" icon="pi pi-check" onClick={this.save} />
      </div>
    );
  }

  // Se ejecuta una sola vez luego que el DOM se ha cargado.
  // Encargado de obtener el arreglo de personas.
  componentDidMount() {
    this.personaService.getAll().then(data => this.setState({ personas: data }));
  }

  save() {
    this.personaService.save(this.state.persona).then(data => {
      this.setState({
        visible: false,
        persona: {
          nombre: null,
          apellido: null,
          direccion: null,
          telefono: null
        }
      });
      this.growl.show({ severity: 'success', summary: 'Atención', detail: 'Se guardó el registro correctamente.' });
      this.personaService.getAll().then(data => this.setState({ personas: data }));
    })
  }

  delete() {
    if (window.confirm("Está seguro que desea eliminar el registro?")) {
      this.personaService.delete(this.state.selectedPersona.id).then(() => {
        this.growl.show({ severity: 'success', summary: 'Atención', detail: 'Se eliminó el registro correctamente.' });
        this.personaService.getAll().then(data => this.setState({ personas: data }));
      });
    }
  }

  render() {
    return (
      <div style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
        <Menubar model={this.items}></Menubar>
        <br />
        <Panel header="React CRUD app" >
          <DataTable value={this.state.personas} paginator={true} rows="4" selectionMode="single" selection={this.state.selectedPersona} onSelectionChange={e => this.setState({ selectedPersona: e.value })}>
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="apellido" header="Apellido"></Column>
            <Column field="direccion" header="Dirección"></Column>
            <Column field="telefono" header="Telefono"></Column>
          </DataTable>
        </Panel>
        <Dialog header="Crear persona" visible={this.state.visible} style={{ width: '400px' }} footer={this.footer} modal={true} onHide={() => this.setState({ visible: false })}>
          <br />
          <span className="p-float-label">
            <InputText value={this.state.persona.nombre} style={{ width: '100%' }} id="nombre" onChange={(e) => {
              let val = e.target.value;
              this.setState(prevState => {
                let persona = Object.assign({}, prevState.persona);
                persona.nombre = val
                return { persona };
              })
            }
            } />
            <label htmlFor="nombre">Nombre</label>
          </span>
          <br />
          <span className="p-float-label">
            <InputText value={this.state.persona.apellido} style={{ width: '100%' }} id="apellido" onChange={(e) => {
              let val = e.target.value;
              this.setState(prevState => {
                let persona = Object.assign({}, prevState.persona);
                persona.apellido = val
                return { persona };
              })
            }
            } />
            <label htmlFor="apellido">Apellido</label>
          </span>
          <br />
          <span className="p-float-label">
            <InputText value={this.state.persona.direccion} style={{ width: '100%' }} id="direccion" onChange={(e) => {
              let val = e.target.value;
              this.setState(prevState => {
                let persona = Object.assign({}, prevState.persona);
                persona.direccion = val
                return { persona };
              })
            }
            } />
            <label htmlFor="direccion">Direccion</label>
          </span>
          <br />
          <span className="p-float-label">
            <InputText value={this.state.persona.telefono} style={{ width: '100%' }} id="telefono" onChange={(e) => {
              let val = e.target.value;
              this.setState(prevState => {
                let persona = Object.assign({}, prevState.persona);
                persona.telefono = val
                return { persona };
              })
            }
            } />
            <label htmlFor="telefono">Telefono</label>
          </span>
        </Dialog>
        <Growl ref={(el) => this.growl = el} />
      </div>
    );
  }

  showSaveDialog() {
    this.setState(
      {
        visible: true,
        persona: {
          nombre: null,
          apellido: null,
          direccion: null,
          telefono: null
        }
      });
  }

  showEditDialog() {
    this.setState(
      {
        visible: true,
        persona: {
          id: this.state.selectedPersona.id,
          nombre: this.state.selectedPersona.nombre,
          apellido: this.state.selectedPersona.apellido,
          direccion: this.state.selectedPersona.direccion,
          telefono: this.state.selectedPersona.telefono
        }
      });
  }
}

export default App;
