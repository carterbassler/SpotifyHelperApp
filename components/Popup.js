import React from 'react'

function Popup(props) {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-button bg-[#18D680] hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-3 rounded-full text-sm' onClick={() => props.setTrigger(false)}>Close</button>
                <h3 className='text-center align-center justify-center font-bold text-white'>Playlist Saved Successfully!</h3>
            </div>
        </div>
    ) : "";
}

export default Popup