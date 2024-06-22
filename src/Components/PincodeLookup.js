// src/components/PincodeLookup.js
import React, { useState } from 'react';
import axios from 'axios';


const PincodeLookup = () => {
    const [pincode, setPincode] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');

    const handleLookup = async () => {
        if (pincode.length !== 6 || isNaN(pincode)) {
            alert('Please enter a valid 6-digit pincode.');
            return;
        }

        setLoading(true);
        setError('');
        setData([]);

        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const result = response.data[0];

            if (result.Status === 'Success') {
                setData(result.PostOffice);
            } else {
                setError('Invalid pincode or data not found.');
            }
        } catch (error) {
            setError('Error fetching data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(postOffice => postOffice.Name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="pincode-lookup">
            <h1>Enter Pincode</h1>
           <div id='search-container'>
           <input
            id='search-input'
                type="text"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
            />
            <button id='lookup-btn' onClick={handleLookup}>Lookup</button>
           </div>

            {loading && <div className="loader">Loading...</div>}

            {error && <div className="error">{error}</div>}

            {data.length > 0 && (
                <div className='container'>
                    <input
                    className='filter-input'
                    id='search-input'
                        type="text"
                        placeholder="Filter"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                    {filteredData.length > 0 ? (
                        <ul className="post-office-list">
                            {filteredData.map(postOffice => (
                                <div className='container'>
                                    <li key={postOffice.Name}>
                                    <div><b>Name:</b> {postOffice.Name}</div>
                                    <div><b>Delivey Status:</b> {postOffice.DeliveryStatus}</div>
                                    <div><b>Branch Type :</b> {postOffice.BranchType}</div>
                                    <div><b>Division :</b> {postOffice.Division}</div>
                                    <div><b>Pincode: </b>{postOffice.Pincode}</div>
                                    <div><b>District: </b>{postOffice.District}</div>
                                    <div><b>State:</b> {postOffice.State}</div>
                                </li>
                                </div>
                                
                            ))}
                        </ul>
                    ) : (
                        <div>Couldn’t find the postal data you’re looking for…</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PincodeLookup;
