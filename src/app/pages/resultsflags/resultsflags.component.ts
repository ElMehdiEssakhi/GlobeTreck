import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlagsMComponent } from '../game/flags-maplibre/flagsm.component';
import { LeaderboardService } from '../../services/leaderboard.service';

export interface LeaderboardEntry {
  name: string;
  score: number;
  time: string;
  mode: string;
}

@Component({
  selector: 'app-resultsflags',
  imports: [CommonModule , FlagsMComponent],
  templateUrl: './resultsflags.component.html',
  styleUrls: ['./resultsflags.component.css']
})
export class ResultsflagsComponent implements OnInit {
  // Data received via query parameters
  flagName: string = '';
  flagImage: string = '';
  guessedCountry: string = '';
  timeLeft: number = 0;
  roundScore: number = 0;
  totalScore: number = 0;
  round: number = 1;
  isFinal: boolean = false;
  timePassed: number = 0;
  istrue: boolean = false;

  // Additional country details to be fetched
  capital: string = 'N/A';
  population: number = 0;
  latitudeCorrect: number = 0;
  longitudeCorrect: number = 0;
  latitudeGuessed: number = 0;
  longitudeGuessed: number = 0;

  // Loading / error states for the fetch
  loading: boolean = true;
  error: string = '';

  constructor(private route: ActivatedRoute, private router: Router , private leaderboardService: LeaderboardService ) {}

  ngOnInit(): void {
    // Retrieve data from query parameters
    this.route.queryParams.subscribe(params => {
      this.flagName = params['flagName'] || '';
      this.flagImage = params['flagImage'] || '';
      this.guessedCountry = params['guessedCountry'] || '';
      this.timeLeft = +params['timeLeft'] || 0;
      this.roundScore = +params['roundScore'];
      this.totalScore = +params['totalScore'];
      this.round = +params['currentRound'] || 1;
      this.timePassed = +params['timePassed'] || 0;

      // Fetch additional details for the correct country
      if (this.flagName) {
        this.fetchCountryDetails(this.flagName);
        this.fetchGuessedCountryDetails();
      } else {
        this.loading = false;
        this.error = 'No country name provided';
      }
    });
    this.totalScore += this.roundScore;
    if (this.guessedCountry == this.flagName) {
      this.istrue = true;
    }
    if (this.round == 10) {
      this.isFinal = true;
    }
  }

  fetchCountryDetails(countryName: string): void {
    // Use the REST Countries API to fetch details about the country
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching details for ${countryName}`);
        }
        return response.json();
      })
      .then(data => {
        const countryData = data[0]; // Assume the first entry is the correct one
        this.capital = countryData.capital && countryData.capital.length > 0 ? countryData.capital[0] : 'N/A';
        this.population = countryData.population || 0;
        this.latitudeCorrect = countryData.latlng ? countryData.latlng[0] : 0;
        this.longitudeCorrect = countryData.latlng ? countryData.latlng[1] : 0;
        this.loading = false;
      })
      .catch(err => {
        console.error('Error fetching country details:', err);
        this.error = 'Failed to fetch country details';
        this.loading = false;
      });
  }
  // Fetch additional details for the guessed country
  fetchGuessedCountryDetails(): void {
    if (this.guessedCountry) {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(this.guessedCountry)}?fullText=true`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching details for ${this.guessedCountry}`);
          }
          return response.json();
        })
        .then(data => {
          const countryData = data[0]; // Assume the first entry is the correct one
          this.latitudeGuessed = countryData.latlng ? countryData.latlng[0] : 0;
          this.longitudeGuessed = countryData.latlng ? countryData.latlng[1] : 0;
        })
        .catch(err => {
          console.error('Error fetching guessed country details:', err);
        });
    }
  }


  // Navigate to the next round (or back to the game)
  goToNextRound(): void {
    // Increment the round counter
    this.round++;
    // For example, navigate back to the flags mode component.
    this.router.navigate(['/flags'], { 
      queryParams: { totalScore : this.totalScore, round: this.round , timePassed: this.timePassed}
    });
  }

    // Leaderboard
    saveScore() {
      const playerName = prompt("Enter your name:");
      if (!playerName) return;
  
  
      const newEntry: LeaderboardEntry = {
        name: playerName,
        score: this.totalScore,
        time: `${Math.floor( this.timePassed / 60)}m ${this.timePassed % 60}s`,
        mode: 'Flags Mode'

      };
  
      this.leaderboardService.addEntry(newEntry);
      this.timePassed = 0;
    }

    // Navigate to the leaderboard
    goToLeaderboard() {
      this.router.navigate(['/leaderboard']);
    }

    // Restart the game
    restartGame() {
      this.router.navigate(['/flags']);
    }
}


