// Components, functions, plugins
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'page-loginsample',
  templateUrl: './loginsample.page.html',
  styleUrls: ['./loginsample.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginSamplePage {

	public CommentEntry: string;
	
	constructor(private modal: ModalController
			) {}
	
  async closeModal() {
    //const onClosedData: string = "Wrapped Up!";
    //await this.modal.dismiss(onClosedData);
    await this.modal.dismiss();
  }

}
