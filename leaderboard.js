/*
Exercise Goal:
    - The goal of this exercise is to show us how you apply software engineering 
    principles to create a maintainable software solution.

    How to approach this:

            - Don't worry about persistence. It would make sense here, but for this
            exercise only use in-memory data structures.
            - Don't worry about tricks or "gotchyas", as there aren't any.
            - Just focus on writing clean maintainable code.



Specification:

    Create a class LeaderBoard whose interface includes the following methods:

    Method Name: add_score

        - Add a new score to the player's average. If a player doesn't exist in the 
        LeaderBoard, they will be automatically added.

        Args:

                player_id (Integer): The player's ID.
                score (Integer): The score to record for the player

        Returns:

                Double: The new average score for the given player

    Method Name: top

        - Get the top player_ids on the leaderboard ordered by their average scores
        from highest to lowest

        Args:

                num_players (Integer): The maximum number of player_ids to return

        Returns:

                List<Integer>: a list of player_ids

    Method Name: reset

        - Removes any scoring information for a player, effectively 
        resetting them to 0

        Args:

                player_id (Integer): The player's ID.

Example Usage:


    // Create a new LeaderBoard Instance
    LeaderBoard leader_board = new LeaderBoard();

    // Add scores for players to the LeaderBoard
    leader_board.add_score(1, 50); // 50.0
    leader_board.add_score(2, 80); // 80.0
    leader_board.add_score(2, 70); // 75.0
    leader_board.add_score(2, 60); // 70.0
    leader_board.add_score(3, 90); // 90.0
    leader_board.add_score(3, 85); // 87.5

    // Get top positions for the leaderboard
    leader_board.top(3); // [3, 2, 1]
    leader_board.top(2); // [3, 2]
    leader_board.top(1); // [3]

    // Reset a player 3's scores
    leader_board.reset(3); // void

    // Player 3 is now at the bottom of the leaderboard
    leader_board.top(3); // [2, 1, 3]

Expected values

    - Player IDs will always be positive integers small enough to be 
    stored as a signed 32-bit integer Scores are integers ranging from 0-100


We have provided stubbed out code and tests for you below. Please note that these tests are not exhaustive and do not cover all corner cases. We recommend extending the given tests to ensure your code is correct.

*/


// Your code goes here. Feel free to make helper classes if needed

class Player {
  constructor() {
    this.scores = [];
    this.avg = this.getAvg();
  }

  getAvg = () => {
    return this.scores.reduce((a, c) => a + c.score, 0) / this.scores.length || 0;
  }

  addNewScore = (score, dateCreated) => {
    this.scores.push({ score, dateCreated });
  }

	expireScore = (exp) => {
		for (let i = 0; i < this.scores.length; i++) {
			console.log(this.scores[i].dateCreated, exp)
			if (this.scores[i].dateCreated >= exp) {
				this.scores[i] = 0;
      }
		}
		this.scores = this.scores.filter(Boolean);
    this.avg = this.getAvg();
  }

  resetScores = () => {
    return this.scores = [];
  }
}

class LeaderBoard {
  constructor() {
    this.players = {};
  }

  add_score = (player_id, score, dateCreated) => {
    const player = this.players[player_id] || new Player();
    this.players[player_id] = player;
    player.addNewScore(score, dateCreated);
		player.avg = player.getAvg();
		
    return player.avg;
  }

  rankPlayers = (num_players, top = true) => {
    const playersRanked = Object.entries(this.players);
    
    if (!top) {
      playersRanked.sort((a, b) => a[1].avg >= b[1].avg ? 1 : -1);
    } else {
      playersRanked.sort((a, b) => a[1].avg >= b[1].avg ? -1 : 1);
    }

    return playersRanked.slice(0, num_players).map(p => parseInt(p[0]));
  }

  top = (num_players) => {
    return this.rankPlayers(num_players);
  }

  bottom = (num_players) => {
    return this.rankPlayers(num_players, false);
  }

	setExpiration = (exp) => {
		let returnValue = []
    for (let player in this.players) {
			this.players[player].expireScore(exp);
			returnValue.push({ [player]: this.players[player].scores.map(obj => JSON.stringify(obj)) })
		}
		
    return returnValue;
  }

  reset = (player_id) => {
    const player = this.players[player_id] || new Player();
    this.players[player_id] = player;
    player.scores = player.resetScores();
    player.avg = player.getAvg();
  }
}

// Test code here

function array_equals(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
	}
	
  return true;
}

var leader_board = new LeaderBoard();

leader_board.add_score(1, 50, 7);
console.log(leader_board.add_score(2, 80, 8) == 80);
console.log(leader_board.add_score(2, 7, 12) == 75);
console.log(leader_board.add_score(2, 60, 7) == 70);
console.log('Add score should return the average. test with 1 score');
console.log(leader_board.add_score(3, 90, 6) == 90);
console.log('Add score should return the average. test with 2 scores');
console.log(leader_board.add_score(3, 85, 4) == 87.5);
console.log('Top 3 [' + leader_board.top(3) + '] should equal [3, 2, 1]:');
console.log(array_equals(leader_board.top(3), [3, 2, 1]));
console.log('Top 2 [' + leader_board.top(2) + '] should equal [3, 2]:');
console.log(array_equals(leader_board.top(2), [3, 2]));
// leader_board.reset(3);
console.log('After reset top 3 [' + leader_board.top(3) + '] should equal [2, 1, 3]');
console.log(array_equals(leader_board.top(3), [2, 1, 3]));
console.log('After reset bottom 3 [' + leader_board.bottom(3) + '] should equal [3, 1, 2]');
console.log('Bottom 2 [' + leader_board.bottom(2) + '] should equal [3, 1]');
console.log(leader_board.players[1]);
console.log('unexpired scores: ', leader_board.setExpiration(5000),'\nexpired scores: ', leader_board.setExpiration(6));