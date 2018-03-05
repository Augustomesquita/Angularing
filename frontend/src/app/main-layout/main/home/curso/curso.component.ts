import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'app/service/curso/curso.service';
import { ICurso } from 'app/shared/curso.interface';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss']
})
export class CursoComponent implements OnInit {

  private id: number
  private curso: ICurso

  constructor(
    private activatedRoute: ActivatedRoute,
    private cursoService: CursoService
  ) { }

  ngOnInit() {
    // Resgata id que está sendo passado como parâmetro
    this.activatedRoute.params.subscribe((params) => this.id = params['id'])

    // Loga no console
    this.curso = this.cursoService.getCurso(this.id)
    console.log('CURSO LOGADO: ' + this.curso)
  }

}