// first we write JS files using ES6 scripts
// convert them to react using babel

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';
import _ from 'lodash';

import SearchBar from './components/search_bar';
import VideoList from './components/video_list';
import VideoDetails from './components/video_details';

const YOUTUBE_VIDEOS_API_KEY = 'AIzaSyDOr1w-ABSoDdRQQUsPHkuwJaIrmQpw0mI';



class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            videos : [],
            selectedVideo : null
        };

        this.videoSearch(''); 
    }

    videoSearch(term) {
        YTSearch( { key : YOUTUBE_VIDEOS_API_KEY, term : term }, (videos) => {
            this.setState({ 
                videos : videos,
                selectedVideo : videos[0]
            });
        });
    }

    render(){

        const videoSearch = _.debounce((term) => {this.videoSearch(term)},300);

        return(
            <div>
                <SearchBar onSearchTermChange={videoSearch} />
                <VideoDetails video={this.state.selectedVideo} />
                <VideoList 
                    onVideoSelect={selectedVideo => this.setState({selectedVideo})} 
                    videos={ this.state.videos} 
                />
            </div>
        );
    }
}

//Take all those JS file create a bundle using class instance
// and then inject them in HTML page (i.e in DOM )

ReactDOM.render(<App />, document.querySelector('.container') );