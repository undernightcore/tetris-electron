const timeToReloadPage = 3000;
const limitRanking = 5;
const sdk = initSDK();
const options = [
	'A la siguiente igual..',
	'Bueno, quiza el tetris no es lo tuyo',
	'Al pozo',
	'Eh, no te piques',
	'Chill, solo es un juego',
	'Anda mira, un mono jugando',
	'Eso es todo? Vaya tela',
	'Pero bueno.. ya has terminado?',
];

let idSession, idUser, idDocumento, documentos, posicion;

document.addEventListener('DOMContentLoaded', (e) => {
	deleteSession();
});

document.addEventListener('submit', (e) => {
	e.preventDefault();
	showSpinner();

	correo = document.getElementById('correo').value;
	password = document.getElementById('password').value;

	createSession(
		correo,
		password,
		() => {
			init();
		},
		() => {
			console.log('Deberia mostrar una alerta de error');
			hideSpinner();
		}
	);
});
