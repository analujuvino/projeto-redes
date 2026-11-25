# Segurança em Redes Wi-Fi

Seminário de **Redes de Computadores**, UNIESP, Ciência da Computação (25/11/2026).

Apresentação em formato de site, feita com HTML, CSS e JavaScript puros, sem frameworks.

**Equipe:** Ana Lucia Juvino · Bya Gonçalves · Adailton Neto · Samuel Gomes

## Como navegar

| Ação | Teclado | Mouse / toque |
| --- | --- | --- |
| Próximo / anterior | → / ← (ou Espaço) | botões no canto inferior direito, ou deslizar |
| Menu de slides | M | ícone ☰ |
| Notas do apresentador | N | ícone de balão |
| Tela cheia | F | ícone de expandir |
| Primeiro / último slide | Home / End | |

Cada slide tem endereço próprio: `/#7` abre direto no slide 7.

## Interações

- **Capa:** terminal com o `scan --wifi` e o subtítulo digitado letra a letra.
- **Roteiro:** cada bloco é clicável e leva ao slide correspondente.
- **Handshake:** o botão *Simular* acende as 4 mensagens em sequência.
- **Ataques:** simulação de ataque de dicionário; os cartões viram ao clicar e mostram a defesa.
- **Evil Twin:** escolha entre duas redes com o mesmo nome e veja o que acontece.
- **Proteção em casa:** checklist clicável com medidor e um teste de força de senha. O teste é uma estimativa feita só no navegador; nada é enviado.
- **Wi-Fi público:** rede de pontos animada que reage ao mouse.
- **Perguntas:** quiz rápido de 3 questões.

## Estrutura

```
index.html   os 12 slides
style.css    visual (paleta, profundidade, animações)
script.js    navegação e interações
img/         imagens da apresentação
```

## Publicar no Vercel

1. Suba esta pasta para um repositório no GitHub.
2. No Vercel: **Add New → Project**, escolha o repositório e clique em **Deploy**. Não precisa de configuração: é um site estático.

## Créditos

- Imagens geradas com IA a partir de prompts próprios da equipe.
- Fonte [Doto](https://fonts.google.com/specimen/Doto) (Google Fonts, SIL Open Font License).
- Ícones desenhados a partir do conjunto [Feather](https://feathericons.com) (licença MIT).
- Referências: Kurose & Ross, *Redes de Computadores e a Internet*, cap. 8; Tanenbaum, *Redes de Computadores*, cap. 8; Wi-Fi Alliance, *WPA3*.
