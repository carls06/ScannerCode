import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

//sqlite para guardar info de manera nativa 
import { Storage } from '@ionic/storage';
//para navegar entre paginas 
import { NavController } from '@ionic/angular';

// navegador nativo
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

//copiar en el porta papeles
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

    guardados:Registro[]=[];
  constructor(private storage:Storage,
     private navctrl:NavController,
     private iAB:InAppBrowser,
     private clipboard:Clipboard,
     private toastController: ToastController) { 
      
    this.cargarStorage();
  }

  async cargarStorage(){
      this.guardados=(await this.storage.get('registros'))||[];
  }

  async guardarRegistro(format:string, text:string){
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format,text);
     
    this.guardados.unshift(nuevoRegistro);

    this.storage.set('registros',this.guardados);
    this.abrirRegistro(nuevoRegistro);

      
  }

  abrirRegistro(regis:Registro){
      this.navctrl.navigateForward('/tabs/tab2');
      
      switch(regis.type){

        case 'http':
            this.iAB.create(regis.text,'_system');

        break;
        case 'geo':
            this.navctrl.navigateForward(`/tabs/tab2/mapa/${regis.text}`);

        break;
        default:
            this.clipboard.copy(regis.text);
            this.presentToast('Saved to Clipboard');

           
            break;
      }


  }
  borrar(){
      this.storage.remove('registros');
      this.presentToast('cleaned');
      this.cargarStorage();

  }
  
    async presentToast(msj:string) {
        const toast = await this.toastController.create({
          message: msj,
          duration: 2000
        });
        toast.present();
      }
  

  
}
