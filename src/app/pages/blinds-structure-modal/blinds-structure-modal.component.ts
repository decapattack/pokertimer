import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface para um nível de blind, pode ser exportada para uso em outros componentes.
export interface BlindLevel {
  sb: number;
  bb: number;
}

@Component({
  selector: 'app-blinds-structure-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blinds-structure-modal.component.html',
  styleUrls: ['./blinds-structure-modal.component.css']
})
export class BlindsStructureModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<BlindLevel[]>();

  // Controle de abas
  public activeTab: 'templates' | 'personalizar' = 'templates';

  // Aba 'Personalizar'
  public estruturaAtual: BlindLevel[] = [];
  public newSb: number | null = null;
  public newBb: number | null = null;

  // Aba 'Templates'
  public templates: any[] = [];

  // Propriedades para os valores das sugestões
  public sugestaoDobro: BlindLevel | null = null;
  public sugestao50: BlindLevel | null = null;
  public sugestao25: BlindLevel | null = null;

  constructor() {}

  ngOnInit(): void {
    // A estrutura agora começa sempre com o nível 1 fixo.
    this.estruturaAtual = [{ sb: 25, bb: 50 }];

    this.carregarTemplates();
    this.calcularSugestoes(); // Calcula as sugestões iniciais
  }

  // --- LÓGICA DA ABA PERSONALIZAR ---

  adicionarNivel(): void {
    if (this.newSb && this.newBb && this.newSb > 0 && this.newBb > 0) {
      this.estruturaAtual.push({ sb: this.newSb, bb: this.newBb });
      this.newSb = null;
      this.newBb = null;
      this.calcularSugestoes(); // Recalcula as sugestões
    }
  }

  removerNivel(index: number): void {
    if (this.estruturaAtual.length > 1) { // Impede remover o último nível
      this.estruturaAtual.splice(index, 1);
      this.calcularSugestoes(); // Recalcula as sugestões
    } else {
      alert("A estrutura precisa ter pelo menos um nível.");
    }
  }

  private calcularSugestoes(): void {
    if (this.estruturaAtual.length > 0) {
      const ultimoNivel = this.estruturaAtual[this.estruturaAtual.length - 1];
      const lastBB = ultimoNivel.bb;

      // Dobrar BB
      this.sugestaoDobro = { sb: lastBB, bb: lastBB * 2 };

      // Aumentar 50% (arredondando para o múltiplo de 25 mais próximo)
      const bb50 = Math.round((lastBB * 1.5) / 25) * 25;
      this.sugestao50 = { sb: Math.round(bb50 / 2), bb: bb50 };

      // Aumentar 25% (arredondando para o múltiplo de 25 mais próximo)
      const bb25 = Math.round((lastBB * 1.25) / 25) * 25;
      this.sugestao25 = { sb: Math.round(bb25 / 2), bb: bb25 };

    } else {
      // Estado inicial caso a tabela esteja vazia
      this.sugestaoDobro = { sb: 25, bb: 50 };
      this.sugestao50 = { sb: 15, bb: 30 };
      this.sugestao25 = { sb: 10, bb: 20 };
    }
  }

  public aplicarSugestao(sugestao: BlindLevel | null): void {
    if (sugestao) {
      this.newSb = sugestao.sb;
      this.newBb = sugestao.bb;
    }
  }

  // --- LÓGICA DA ABA TEMPLATES ---
  usarTemplate(template: BlindLevel[]): void {
    this.estruturaAtual = [...template]; // Cria uma cópia para não modificar o template original
    this.activeTab = 'personalizar'; // Muda para a aba de personalização para visualização
    this.calcularSugestoes(); // Recalcula as sugestões com base no novo template
  }

  // --- AÇÕES PRINCIPAIS ---
  salvarEstrutura(): void {
    if (this.estruturaAtual.length > 0) {
      this.save.emit(this.estruturaAtual);
      this.close.emit();
    } else {
      alert('A estrutura de blinds não pode estar vazia.');
    }
  }

  // --- PREENCHIMENTO DOS TEMPLATES ---
  private carregarTemplates(): void {
    this.templates = [
      {
        nome: 'Torneio Rápido (Turbo)',
        descricao: 'Estrutura agressiva para torneios de 2-3 horas.',
        niveis: 8,
        estrutura: [
          { sb: 25, bb: 50 }, { sb: 50, bb: 100 }, { sb: 100, bb: 200 }, { sb: 200, bb: 400 },
          { sb: 400, bb: 800 }, { sb: 800, bb: 1600 }, { sb: 1600, bb: 3200 }, { sb: 3200, bb: 6400 }
        ]
      },
      {
        nome: 'Torneio Padrão',
        descricao: 'Estrutura equilibrada para torneios de 4-6 horas.',
        niveis: 11,
        estrutura: [
          { sb: 25, bb: 50 }, { sb: 50, bb: 100 }, { sb: 75, bb: 150 }, { sb: 100, bb: 200 },
          { sb: 150, bb: 300 }, { sb: 200, bb: 400 }, { sb: 300, bb: 600 }, { sb: 400, bb: 800 },
          { sb: 600, bb: 1200 }, { sb: 800, bb: 1600 }, { sb: 1000, bb: 2000 }
        ]
      },
      {
        nome: 'Torneio Longo (Deep Stack)',
        descricao: 'Estrutura lenta para torneios de 6+ horas.',
        niveis: 13,
        estrutura: [
          { sb: 25, bb: 50 }, { sb: 50, bb: 75 }, { sb: 50, bb: 100 }, { sb: 75, bb: 150 },
          { sb: 100, bb: 200 }, { sb: 150, bb: 250 }, { sb: 150, bb: 300 }, { sb: 200, bb: 400 },
          { sb: 250, bb: 500 }, { sb: 300, bb: 600 }, { sb: 400, bb: 800 }, { sb: 500, bb: 1000 }, { sb: 600, bb: 1200 }
        ]
      },
      {
        nome: 'Club Special (Estilo Lento)',
        descricao: 'Progressão muito lenta, ideal para jogos longos.',
        niveis: 9,
        estrutura: [
          { sb: 25, bb: 50 }, { sb: 25, bb: 50 }, { sb: 50, bb: 100 }, { sb: 50, bb: 100 },
          { sb: 75, bb: 150 }, { sb: 100, bb: 200 }, { sb: 150, bb: 300 }, { sb: 200, bb: 400 }, { sb: 250, bb: 500 }
        ]
      }
    ]; // ✅ O COLCHETE E PONTO-E-VÍRGULA FALTANTES FORAM ADICIONADOS AQUI.
  }
}
