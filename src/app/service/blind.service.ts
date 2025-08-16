import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnteConfig } from '../pages/ante-modal/ante-modal.component'; // Import a interface


// MODIFICADO: Interface renomeada para maior clareza.
export interface NivelDeBlind {
  sb: number;
  bb: number;
  ante: number | null; // Alterado de 'number' para 'number | null'
}

const DEFAULT_BLINDS_STRUCTURE = [
    // Fase 1: Inicial (Fichas de 25 em jogo)
    { sb: 25, bb: 50 },
    { sb: 50, bb: 100 },
    { sb: 75, bb: 150 },
    // --> Color Up: Remover fichas de 25

    // Fase 2: Intermediária (Fichas de 100 em jogo)
    { sb: 100, bb: 200 },
    { sb: 150, bb: 300 },
    { sb: 200, bb: 400 },
    { sb: 300, bb: 600 },
    { sb: 400, bb: 800 },
    { sb: 500, bb: 1000 },
    { sb: 600, bb: 1200 },
    { sb: 800, bb: 1600 },
    // --> Color Up: Remover fichas de 100

    // Fase 3: Milhares (Fichas de 500 e 1.000 em jogo)
    { sb: 1000, bb: 2000 },
    { sb: 1500, bb: 3000 },
    { sb: 2000, bb: 4000 },
    { sb: 2500, bb: 5000 },
    { sb: 3000, bb: 6000 },
    { sb: 4000, bb: 8000 },
    { sb: 5000, bb: 10000 },
    { sb: 6000, bb: 12000 },
    { sb: 8000, bb: 16000 },
    { sb: 10000, bb: 20000 },
    { sb: 12000, bb: 25000 },
    { sb: 15000, bb: 30000 },
    { sb: 20000, bb: 40000 },
    { sb: 25000, bb: 50000 },
    { sb: 30000, bb: 60000 },
    { sb: 40000, bb: 80000 },
    { sb: 50000, bb: 100000 },
    // --> Color Up: Remover fichas de 500 e 1.000

    // Fase 4: Centenas de Milhares (Fichas de 5.000 e 25.000 em jogo)
    { sb: 60000, bb: 120000 },
    { sb: 80000, bb: 160000 },
    { sb: 100000, bb: 200000 },
    { sb: 125000, bb: 250000 },
    { sb: 150000, bb: 300000 },
    { sb: 200000, bb: 400000 },
    { sb: 250000, bb: 500000 },
    { sb: 300000, bb: 600000 },
    { sb: 400000, bb: 800000 },
    { sb: 500000, bb: 1000000 },
    // --> Color Up: Remover fichas de 5.000

    // Fase 5: Milhões (Fichas de 25.000 e 100.000 em jogo)
    { sb: 600000, bb: 1200000 },
    { sb: 800000, bb: 1600000 },
    { sb: 1000000, bb: 2000000 },
    { sb: 1200000, bb: 2500000 },
    { sb: 1500000, bb: 3000000 },
    { sb: 2000000, bb: 4000000 },
    { sb: 2500000, bb: 5000000 },
    { sb: 3000000, bb: 6000000 },
    { sb: 4000000, bb: 8000000 },
    { sb: 5000000, bb: 10000000 },
    // --> Color Up: Remover fichas de 25.000

    // Fase 6: Dezenas e Centenas de Milhões (Fichas de 100.000 e 500.000 em jogo)
    { sb: 6000000, bb: 12000000 },
    { sb: 8000000, bb: 16000000 },
    { sb: 10000000, bb: 20000000 },
    { sb: 12000000, bb: 25000000 },
    { sb: 15000000, bb: 30000000 },
    { sb: 20000000, bb: 40000000 },
    { sb: 25000000, bb: 50000000 },
    { sb: 30000000, bb: 60000000 },
    { sb: 40000000, bb: 80000000 },
    { sb: 50000000, bb: 100000000 },
    { sb: 60000000, bb: 120000000 },
    { sb: 80000000, bb: 160000000 },
    { sb: 100000000, bb: 200000000 },
    { sb: 125000000, bb: 250000000 },
    { sb: 150000000, bb: 300000000 },
    { sb: 200000000, bb: 400000000 },
    { sb: 250000000, bb: 500000000 },
    { sb: 300000000, bb: 600000000 },
    { sb: 400000000, bb: 800000000 },
    { sb: 500000000, bb: 1000000000 },
    // --> Color Up: Remover fichas de 100.000 e 500.000

    // Fase 7: Bilhões (Fichas de 1 Milhão+ em jogo)
    { sb: 600000000, bb: 1200000000 },
    { sb: 800000000, bb: 1600000000 },
    { sb: 1000000000, bb: 2000000000 },
    { sb: 1200000000, bb: 2500000000 },
    { sb: 1500000000, bb: 3000000000 },
    { sb: 2000000000, bb: 4000000000 },
    { sb: 2500000000, bb: 5000000000 },
    { sb: 3000000000, bb: 6000000000 },
    { sb: 4000000000, bb: 8000000000 },
    { sb: 5000000000, bb: 10000000000 },
    // A progressão continua...
    { sb: 10000000000, bb: 20000000000 },
    { sb: 15000000000, bb: 30000000000 },
    { sb: 20000000000, bb: 40000000000 },
    { sb: 25000000000, bb: 50000000000 },
    { sb: 30000000000, bb: 60000000000 },
    { sb: 40000000000, bb: 80000000000 },
    { sb: 50000000000, bb: 100000000000 },
    { sb: 100000000000, bb: 200000000000 },
    { sb: 150000000000, bb: 300000000000 },
    { sb: 200000000000, bb: 400000000000 },
    { sb: 250000000000, bb: 500000000000 },
    { sb: 300000000000, bb: 600000000000 },
    { sb: 400000000000, bb: 800000000000 },

    // Fase 8: O Trilhão
    { sb: 500000000000, bb: 1000000000000 }
];

@Injectable({
  providedIn: 'root'
})
export class BlindService {

  // 2. Esta é a estrutura "viva", que pode ser modificada durante a sessão.
  private estruturaBlinds: { sb: number, bb: number }[];
  private nivelAtual = 0;
  private anteConfig: AnteConfig = { type: 'none', value: 0 };
  private blindsSubject: BehaviorSubject<NivelDeBlind>;

  public blindsAtuais$: Observable<NivelDeBlind>;

  constructor() {
    // 3. No início, a estrutura "viva" é sempre uma cópia da padrão.
    this.estruturaBlinds = [...DEFAULT_BLINDS_STRUCTURE];

    this.blindsSubject = new BehaviorSubject<NivelDeBlind>(this.getNivelFormatado(0));
    this.blindsAtuais$ = this.blindsSubject.asObservable();
  }

  // 4. Este método agora substitui a estrutura APENAS em memória.
  public definirNovaEstrutura(novaEstrutura: { sb: number, bb: number }[]): void {
    this.estruturaBlinds = novaEstrutura;
    this.resetarNiveis();
  }

  public avancarNivel(): void {
    if (this.nivelAtual < this.estruturaBlinds.length - 1) {
      this.nivelAtual++;
      this.blindsSubject.next(this.getNivelFormatado(this.nivelAtual));
    }
  }

  public resetarNiveis(): void {
    this.nivelAtual = 0;
    this.blindsSubject.next(this.getNivelFormatado(this.nivelAtual));
  }

  // 5. Este método sempre será aplicado na estrutura correta que está em memória.
  public configurarAnte(config: AnteConfig): void {
    this.anteConfig = config;
    this.blindsSubject.next(this.getNivelFormatado(this.nivelAtual));
  }

  private getNivelFormatado(nivel: number): NivelDeBlind {
    const blind = this.estruturaBlinds[nivel];
    let anteValue: number | null = null;

    if (blind.bb >= 200) {
      const defaultAnte = Math.round((blind.bb / 4) / 25) * 25;
      anteValue = defaultAnte;

      if (this.anteConfig.type === 'initial') {
        anteValue = this.anteConfig.value;
      } else if (this.anteConfig.type === 'fraction') {
        const rawAnte = blind.bb / this.anteConfig.value;
        anteValue = Math.round(rawAnte / 25) * 25;
      } else if (this.anteConfig.type === 'none') {
        anteValue = null;
      }
    }

    return {
      sb: blind.sb,
      bb: blind.bb,
      ante: anteValue
    };
  }

  public getEstruturaAtual(): { sb: number, bb: number }[] {
    return [...this.estruturaBlinds]; // Retorna uma cópia da estrutura em memória
  }
}
