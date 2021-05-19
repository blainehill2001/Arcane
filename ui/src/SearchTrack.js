  
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import $ from 'jquery';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Cookies from "js-cookie";


const SearchTrack = ({ seedTracks, updateSeeds, hasLoggedIn}) => {

    const { handleSubmit} = useForm();
    const [trackQuery, setTrackQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [searched, setSearched] = useState(false);

    function handleChange(event) {
        setTrackQuery({...trackQuery, [event.target.name]: event.target.value})
    }

    const onSubmit = () => {
        setSearched(true);
        searchTrackByName(trackQuery.query, 'arcane-token-key');
    }

    function searchTrackByName(track_name, token_key) {

        let url;
        if (process.env.NODE_ENV == "production") {
            url = "/api/trackSearch";
        } else {
            url = "http://localhost:3001/api/trackSearch";
        }

        $.ajax({
            url: url,
            data: {
                track_value: track_name,
                token: Cookies.get(token_key),
                limit: "5",
                type: "GET"
            }
        }).done(function (data) {
            if (responseIsSuccess(data)) {
                setTracks(data.trackResult.tracks.items);
            }
        });
    }

    function responseIsSuccess(data) {
        let error;
        if (data && data.status) {
            error = data.status;
        } else {
            error = data.status.error.response.status || "401";
        }

        var message = data.message;

        if (error && parseInt(error) == 401) {
            alert(message);
            return false;
        }
        if (error && error >= 400) {
            alert(message || "Error: Please try logging in and out again.");
            return false;
        }
        return true;
    }

    function addTracktoSeeds(track){
        let isDuplicate = false;
        seedTracks.forEach((seedTrack) => {if(seedTrack.id == track.id){
            isDuplicate = true;
        }});
        if(seedTracks.length < 5 && isDuplicate == false){
            updateSeeds(seedTracks, track);
        }
        
        
    }


    return(
        <div>
            {hasLoggedIn == true &&
                <div class="mx-auto my-4 px-4 py-4 ring ring-transparent rounded-lg bg-green-700">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div class="flex flex-col">
                            
                            <h4>Search for your top tracks:</h4>
                            <p class="text-xs sm:text-sm md:text-base lg:text-lg p-2">Select a track below to add it to your recommendation seeds:</p>

                            <InputGroup className="mb-3">
                                <Form.Control required id="validationTrack" class="p-12" name="query" placeholder="Enter track name" defaultValue={''} autoComplete="on" onChange={handleChange}/>
                                <InputGroup.Append>
                                <Button class="bg-gray-800" type="submit" defaultValue="Submit" variant="secondary">Submit</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Form>
                    
                    {searched == true && 
                        <div class="flex flex-row flex-wrap">
                            {tracks.map((track) => {
                                return(
                                    <div class="container mx-auto w-1/2 lg:w-1/5 md:w-1/3 p-3">
                                        <button class="object-cover w-full h-full p-4 ring ring-transparent rounded-lg bg-green-800 hover:bg-blue-500 active:bg-indigo-800" key={track.id} onClick={() => addTracktoSeeds(track)} name={track.name}>   
                                            <div class="flex flex-row flex-wrap justify-around">
                                                <img src={track.album.images[0].url} class="object-contain"/>
                                                <p class="p-1 text-xs sm:text-sm md:text-base lg:text-lg">{track.name} <br /> <i>by {track.artists[0].name}</i></p>
                                            </div>
                                        </button>
                                    </div>
                                    );
                                })}
                        </div>
                    }
                </div>
            }
        </div>
    );
}


export default SearchTrack;