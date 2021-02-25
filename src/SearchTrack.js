import React, { useState } from "react";
import { useForm } from "react-hook-form";
import $ from 'jquery';
import { Form, InputGroup, Button } from 'react-bootstrap';


const SearchTrack = ({ seedTracks, updateSeedTrack }) => {

    const { register, handleSubmit, watch, errors } = useForm();
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

        $.ajax({
            url: "http://localhost:8888/trackSearch",
            data: {
                track_value: track_name,
                token: localStorage.getItem(token_key),
                limit: "5"
            }
        }).done(function (data) {
            if (responseIsSuccess(data)) {
                setTracks(data.trackResult.tracks.items);
            }
        });
    }

    function responseIsSuccess(data) {
        var error;
        if (data && data.status.error == null) {
            error = data.status;
        } else {
            error = data.status.error.response.status || "401";
        }

        var msg = data.message;
        // if unauthorized we need to prompt log in
        if (error && parseInt(error) == 401) {
            alert(msg);
            return false;
        }
        if (error && error >= 400) {
            console.log(msg);
            alert(msg || "Error: Please try logging in and out again.");
            return false;
        }
        return true;
    }

    function addTracktoSeeds(track){

        updateSeedTrack(seedTracks, track);
        
    }


    return(
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col m-10">
                    <Form.Label class="py-1">Search for your top tracks:</Form.Label>
                    <Form.Text className="text-muted py-1">
                        Select a track below to add it to your recommendation seeds
                    </Form.Text>

                    <InputGroup className="mb-3">
                        <Form.Control required id="validationTrack" class="p-12" name="query" placeholder="Enter track name" defaultValue={''} autoComplete="off" onChange={handleChange} ref={register({minLength: 2})}/>
                        <InputGroup.Append>
                        <Button class="bg-gray-800" type="submit" defaultValue="Submit" variant="secondary">Submit</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </Form>
            
            {searched == true && 
                <div class="flex flex-row mx-16 my-4 px-4 py-4 ring rounded-lg">
                    {tracks.map((track) => {
                        return(
                            <div class="container">
                                <button class="object-cover w-full h-full p-4 ring rounded-lg hover:bg-blue-500 active:bg-green-800" key={track.id} onClick={() => addTracktoSeeds(track)} name={track.name}>   
                                    <img src={track.album.images[0].url} />
                                    <p>{track.name} <br /> <i>by {track.artists[0].name}</i></p>
                                </button>
                            </div>
                            );
                        })}
                </div>
            }
        </div>

    );
}


export default SearchTrack;