var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
	return (
  	<div className="col-5">
    	{_.range(props.numberOfStars).map((i) =>
      	<i className="fa fa-star"></i>
      )}
    </div>
  );
}

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
    case true:
			button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
        	<i className="fa fa-check"></i>
        </button>;
      break;
    case false:
			button =
        <button className="btn btn-danger">
        	<i className="fa fa-times"></i>
        </button>;
      break;
    default:
			button =
        <button className="btn" disabled={props.selectedNumbers.length === 0} onClick={props.checkAnswer}>
        	=
        </button>;
      break;
  }

	return (
  	<div className="col-2 text-center">
    {button}
    <br /><br />
    <button disabled={props.redraws === 0} onClick={props.redraw} className="btn btn-warning btn-sm">
      <i className="fa fa-recycle">{props.redraws}</i>
    </button>
    </div>
  );
}

const Answer = (props) => {
	return (
  	<div className="col-5">
        {props.selectedNumbers.map((i) =>
        	<span>{i}</span>
        )}
    </div>
  );
}

const Numbers = (props) => {
	const numberClassName = (number) => {
  	if (props.usedNumbers.indexOf(number) >= 0) {
    	return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
    	return 'selected';
    }
  }

	return (
  	<div className="card text-center">
    	<div>
      	{Numbers.list.map((number, i) =>
        	<span
          	className={numberClassName(number)}
            onClick={() => props.onNumberClick(number)}
          >
            {number}
          </span>
        )}
      </div>
    </div>
  );
}

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
  		<h2>{props.doneStatus}</h2>
      <br />
      <button className="btn btn-secondary" onClick={props.restartGame}>Start again</button>
    </div>
  )
}

Numbers.list = _.range(1, 10);

class Game extends React.Component{
	static getRandomNumber = () => 1 + Math.floor(Math.random() * 9);

  static initialState = () => ({
  	selectedNumbers: [],
    usedNumbers: [],
    randomNumberOfStars: Game.getRandomNumber(),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null
  });

	state = Game.initialState();

  resetGame = () => {
  	this.setState(Game.initialState())
  }

  updateSelectedNumbers = (selectedNumber) =>  {
  	if (this.state.usedNumbers.includes(selectedNumber)) {
    	return;
    }
		if (!this.state.selectedNumbers.includes(selectedNumber)) {
    	this.setState(prevState => ({
      	answerIsCorrect: null,
      	selectedNumbers: prevState.selectedNumbers.concat(selectedNumber)
      })
      )
    } else {
    	this.setState(prevState => ({
      	answerIsCorrect: null,
      	selectedNumbers: prevState.selectedNumbers.filter(number => number !== selectedNumber)
      })
      )
    }
  };

  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const availableNumbers = _.range(1, 10).filter(number => usedNumbers.indexOf(number) === -1)

    return possibleCombinationSum(availableNumbers, randomNumberOfStars);
  }

  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9) {
      	return { doneStatus: "You won!"};
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
      	return { doneStatus: "Game over!"};
      }
    })
  }

  redraw = () => {
  	if(this.state.redraws === 0) {
    	return;
    }
  	this.setState(prevState => ({
    	randomNumberOfStars: Game.getRandomNumber(),
      redraws: prevState.redraws - 1
    }), this.updateDoneStatus)
  }

  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      randomNumberOfStars: Game.getRandomNumber(),
      answerIsCorrect: null
    }), this.updateDoneStatus)
  }

  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((total, n) => total + n, 0)
    }))
  }

  render() {
  	const {randomNumberOfStars,
    			 selectedNumbers,
           usedNumbers,
           answerIsCorrect,
           redraws,
           doneStatus} = this.state;
  	return (
    	<div className="container">
      	<h3>Play nine</h3>
        <hr/>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers={selectedNumbers}
          				checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  redraws={redraws}
                  answerIsCorrect={answerIsCorrect}/>
          <Answer selectedNumbers={selectedNumbers}/>
        </div>
        <br />
        {
        	doneStatus ?
          	<DoneFrame doneStatus={doneStatus} restartGame={this.resetGame}/>
          :
          	<Numbers selectedNumbers={selectedNumbers} usedNumbers={usedNumbers} onNumberClick={this.updateSelectedNumbers}/>
        }
      </div>
    );
  }
}

class App extends React.Component{
	render() {
  	return (
    	<div >
      	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
      	<Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
