import { Component, OnInit, OnDestroy, Renderer, ViewChild, ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from 'app/control/authentication/authentication.service';
import { SettingsService } from 'app/control/settings/settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private notificationOption  = SettingsService.NOTIFICATION_OPTION_DEFAULT;


  private chatOff: boolean;
  private menuOpened: boolean;
  private messagesToAdd: string;
  private message: string;
  private zone: NgZone;
  private webSocket: WebSocket;

  constructor(private authenticationService: AuthenticationService, private http: Http) {
    this.message = '';
    this.zone = new NgZone({ enableLongStackTrace: false });
  }
  

  ngOnInit() {
    this.chatOff = true
    this.menuOpened = false;
    this.messagesToAdd = '';

    // Realiza handshake com options (SSE - Server Side Event)
    // const eventSource = new EventSource(SettingsService.API_URL + '/messagings', SettingsService.getHeaderOptions());

    // Realiza handshake sem options (SSE - Server Side Event)
    // const eventSource = new EventSource(SettingsService.API_URL + '/messagings');
    // eventSource.addEventListener('message-created', (event) => this.messageReceivedFromWebSocket(event.data));

    // Realiza handshake (websocket) e configura o mesmo
    this.webSocket = new WebSocket(SettingsService.API_WS + '/messagings');
    this.webSocket.onmessage = (message) => this.messageReceivedFromWebSocket(message.data);
    
    this.webSocket.onopen = () => {
      console.log('Conexão realizada! O Chat está apto a ser usado.')
      this.chatOff = false;
    }

    this.webSocket.onclose = () => {
      console.log('Conexão finalizada! O Chat ficará inativo.')
      this.chatOff = true;
    }
    
    this.webSocket.onerror = () => {
      console.log('Erro de conexão! O Chat ficará inativo.')
      this.chatOff = true;
    }
  }

  loginFacebook() {
    this.authenticationService.doLoginFacebook();
  }

  loginGoogle() {
    this.authenticationService.doLoginGoogle();
  }






  sendMessage(iptMessage: any) {
    this.message = iptMessage.value;

    if (this.message !== null && this.message.length > 0) {
      this.webSocket.send(this.message);
      iptMessage.value = '';
    }
  }

  messageReceivedFromWebSocket(message: any) {
    this.zone.run(() => {
      if (this.message != message) {
        this.messagesToAdd += '<li><div class="left-chat"><img src="assets/yoshi_chat.png"><p>' + message + '</p></div></li>'
      } else {
        this.messagesToAdd += '<li><div class="right-chat"><img src="assets/mario_chat.png"><p>' + message + '</p></div></li>'
      }
    });
  }

  toggleMessagingBox() {
    this.menuOpened = !this.menuOpened;
  }

  chatInputColorStyle() {
    return {
      'background-color': this.chatOff ? '#EBEBE4' : '#FFF',
      'border-color': this.chatOff ? '#EBEBE4' : '#FFF'
    }
  }

  placeHolderText(): string {
    return this.chatOff ? 'Chat inativo...' : 'Escreva algo...'
  }

}
