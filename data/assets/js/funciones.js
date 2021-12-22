function initSDK() {
	return new Appwrite()
		.setEndpoint('https://api.cloudness.es/v1') // Your API Endpoint
		.setProject('61a5104defa30'); // Your project ID
}

function init() {
	sdk.subscribe('collections.61b4e927864c5.documents', (response) => {
		getDocuments((docs) => {
			drawRanking(docs.slice(0, limitRanking));
			drawPosition(docs);
			documentos = docs;
		});
	});

	getDocument((docs) => {
		if (docs.length == 0) {
			createDocument((res) => {
				drawName(res);
			});
		} else {
			idDocumento = docs[0].$id;
			drawRecord(docs[0].puntuacion);
			drawName(docs[0]);
		}
	});

	getDocuments((docs) => {
		documentos = docs;

		const opciones = {
			autoplay: false,
			autoplayRestart: true,
			showFieldOnStart: true,
			theme: 'candy',
			blockWidth: 10,
			autoBlockWidth: false,
			autoBlockSize: 24,
			difficulty: 'normal',
			speed: 15,

			playText: 'Dale a jugar para empezar',
			playButtonText: 'Jugar',
			gameOverText: getRandomText(),
			restartButtonText: 'Volver a jugar',
			scoreText: 'Puntuación',

			onStart: function () {
				console.log('Partida iniciada!');
			},
			onRestart: function () {
				onLinea(0);
			},
			onGameOver: function (score) {
				drawExitButton();
			},

			onLine: function (lines, scoreIncrement, score) {
				console.log('Has puntuado!');

				updateDocument(score, () => drawRecord(score));
				onLinea(score);
			},
		};

		drawRanking(docs.slice(0, limitRanking));
		drawPosition(docs);

		$('.juego').blockrain(opciones);

		setTimeout(() => {
			showGame();
		}, 700);
	});
}

function isOwnDocument(doc) {
	return idUser === doc.userid;
}

function getRandomText() {
	const n = parseInt(Math.random() * options.length);
	return options[n];
}

function drawRanking(documents) {
	let data = '';

	documents.forEach((doc, index) => {
		data += `
		<div
            class='${
							documentos[index].userid !== doc.userid ||
							documentos[index].puntuacion !== doc.puntuacion
								? 'records'
								: ''
						}' 
            style='${
							isOwnDocument(doc) ? 'border: 1px solid #00ff19;' : ''
						} margin: 5px; padding: 10px; display: flex; justify-content: space-between;'>
            <span class='me-3'>${index + 1}.</span>
            <span class='w-100 text-start'>${
							doc.nombre.length > 10
								? `${doc.nombre.substring(0, 10)} -`
								: doc.nombre
						}</span>
			<span style='text-align: right; color: #00ff19'>${doc.puntuacion}</span>
		</div>`;
	});

	$('#rankingContent').html(`<div style="margin-top: 15px">${data}</div>`);
}

function drawPosition(docs) {
	position = undefined;

	for (let i = 0; i < docs.length; i++) {
		if (docs[i].userid === idUser) {
			$('#posicion').html(
				`<span class="${posicion !== i ? 'records' : ''}">${i + 1}</span>`
			);
			posicion = i;
			return;
		}
	}

	$('#posicion').html('+100');
}

function drawName(doc) {
	$('#jugador').html(
		doc.nombre.length > 10 ? doc.nombre.substring(0, 10) : doc.nombre
	);
}

function drawRecord(puntuacion) {
	$('#record').text(puntuacion);
}

function showGame() {
	document.getElementById('login').classList.add('invisible');
	document.getElementById('pantallaJuego').classList.remove('invisible');
}

function showSpinner() {
	document.getElementById('initSessionButton').classList.add('disabled');
	document.getElementById('initSession').classList.add('invisible');
	document.getElementById('spinner').classList.remove('invisible');
}

function hideSpinner() {
	document.getElementById('initSessionButton').classList.remove('disabled');
	document.getElementById('initSession').classList.remove('invisible');
	document.getElementById('spinner').classList.add('invisible');
}

function onLinea(puntuacion) {
	$('#puntuacion').html(`<span class="records">${puntuacion}</span>`);
}

function drawExitButton() {
	if ($('.salir').length == 0) {
		$('.blockrain-game-over').append(`
			<a class="blockrain-btn salir">Salir</a>
		`);
		$('.salir').on('click', (e) => {
			window.location.reload();
		});
	}
}
