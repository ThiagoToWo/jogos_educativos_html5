var canvas;
var ctx;
var jogo_t0;
var carta_x0 = 1;
var carta_y0 = 50;
var carta_r = 30;
var carta_w = 4 * carta_r;
var carta_h = 4 * carta_r;
var margem = 30;
var deck = [];
var jogoIniciado = false;
var primeiraEscolha = true;
var primeiraCarta;
var segundaCarta;
var combinou;
var combinacoes = 0;
var tentativas = 0;

function Carta(x, y, w, h, info, cor) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h; 
	this.info = info;
	this.cor = cor;
	this.ativa = true;
	
	this.desenharCostas = function() {				
		ctx.save();
		ctx.fillStyle = 'purple';
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.restore();
	}
	
	this.desenharFrente = function() {
		var ang_central = 2 * Math.PI / this.info;
		var centro_x = this.x + this.w / 2;
		var centro_y = this.y + this.h / 2;
		
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.fillRect(this.x, this.y, this.w, this.h);
		
		ctx.beginPath();
		ctx.fillStyle = this.cor;				
	
		ctx.moveTo(
			centro_x + (this.w / 4) * Math.cos((- 0.5) * ang_central),
			centro_y + (this.h / 4) * Math.sin((- 0.5) * ang_central)
		);
		
		for (var i = 1; i < this.info; i++) {
			ctx.lineTo(
				centro_x + (this.w / 4) * Math.cos((i - 0.5) * ang_central),
				centro_y + (this.h / 4) * Math.sin((i - 0.5) * ang_central)
			);
		}
		ctx.fill();
		
		ctx.restore();			
	}
}

function init() {		
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('click', escolher, false);
	fazerDeck();			
	embaralhar();
} 

function fazerDeck() {
	var carta1;
	var carta2;
	var carta3;
	var carta4;
	
	var cx = carta_x0;
	var cy = carta_y0;
	
	for (var i = 3; i < 9; i++) {
		carta1 = new Carta(cx, cy, carta_w, carta_h, i, 'red');
		deck.push(carta1);
		carta2 = new Carta(cx, cy + carta_h + margem, carta_w, carta_h, i, 'red');
		deck.push(carta2);
		carta3 = new Carta(cx, cy + 2 *(carta_h + margem), carta_w, carta_h, i, 'green');
		deck.push(carta3);
		carta4 = new Carta(cx, cy + 3 * (carta_h + margem), carta_w, carta_h, i, 'green');
		deck.push(carta4);
		
		cx += carta_w + margem;
		
		carta1.desenharCostas();
		carta2.desenharCostas();
		carta3.desenharCostas();
		carta4.desenharCostas();
	}	
	
	embaralhar();
}

function embaralhar() {
	var j;
	var k;
	var temp_info;
	var temp_cor;
	var dl = deck.length;
	
	for (var i = 0; i < 3 * dl; i ++) {
		j = Math.floor(Math.random() * dl);
		k = Math.floor(Math.random() * dl);
		
		temp_info = deck[j].info;
		temp_cor = deck[j].cor;
		
		deck[j].info = deck[k].info;
		deck[j].cor = deck[k].cor;
		
		deck[k].info = temp_info;
		deck[k].cor = temp_cor;
	}
}

function escolher(e) {
	if (!jogoIniciado) {
		jogo_t0 = new Date().getTime();
		jogoIniciado = true;
	}
	
	var mx;
	var my;
	
	if (e.layerX || e.layerX == 0) {
		mx = e.layerX;
		my = e.layerY;
	} else if (e.offsetX || e.offsetX == 0) {
		mx = e.offsetX;
		my = e.offsetY;
	}
	
	var i;
	var carta;			
	
	for (i = 0; i < deck.length; i++) {
		carta = deck[i];
		
		if (carta.ativa) { // A carta ainda está no jogo?
			if ((mx > carta.x) && ( mx < carta.x + carta.w) &&
				(my > carta.y) && ( my < carta.y + carta.h)) { // O mouse está sobre esta carta?
				if (primeiraEscolha || i != primeiraCarta) break; // O jogador não está clicando na primeira carta novamente?						
			}
		}
	}
	
	if (i < deck.length) { // O looping for anterior deu break antes de terminar? 				
		if (primeiraEscolha) { // Esta foi a primeira seleção?
			primeiraCarta = i;
			primeiraEscolha = false;					
			
			deck[i].desenharFrente();
		} else { // Caso contrário.	
			tentativas++;
			document.getElementById('tent').innerHTML = tentativas;
			
			canvas.removeEventListener('click', escolher, false); // Desativa as possibilidades de escolhas a mais.
			
			segundaCarta = i;
			
			deck[i].desenharFrente();
			
			if ((deck[segundaCarta].info == deck[primeiraCarta].info) &&
				deck[segundaCarta].cor == deck[primeiraCarta].cor) { // Teve combinação?
				combinou = true;
				// incrementar o número de combinações e exibir pontuação aqui.
				combinacoes++;
				document.getElementById('comb').innerHTML = combinacoes;
				if (combinacoes >= deck.length / 2) { // O jogo acabou?
					var jogo_t = new Date().getTime();							
					var intervalo = Math.floor(0.5 + (jogo_t - jogo_t0) / 1000);
					
					document.getElementById('tempo').innerHTML = intervalo + 's';
				}
			} else { // Não teve combinação.
				combinou = false;
			}
			
			primeiraEscolha = true;
			setTimeout(virarCarta, 1000);
		}
	}			
}

function virarCarta() {
	var c1 = deck[primeiraCarta];
	var c2 = deck[segundaCarta];
	if (!combinou) {
		c1.desenharCostas();
		c2.desenharCostas();
	} else {
		ctx.clearRect(c1.x, c1.y, c1.w, c1.h);
		ctx.clearRect(c2.x, c2.y, c2.w, c2.h);
		
		c1.ativa = false;
		c2.ativa = false;
	}
	
	canvas.addEventListener('click', escolher, false); // Reativa a possibilidade de escolha.
}