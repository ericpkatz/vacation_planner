import React from 'react';

const Vacations = ({ users, vacations, places, cancelVacation })=> {
  return (
    <div>
      <h2>Vacations ({ vacations.length })</h2>
      <ul>
        {
          vacations.map( vacation => {
            const place = places.find(place => place.id === vacation.place_id);
            const user = users.find(user => user.id === vacation.user_id);
            return (
              <li key={ vacation.id }>
                { new Date(vacation.created_at).toLocaleString() }
                <div> 
                  { user ? user.name : '' } is going 
                  to { place ? place.name : '' }
                  <p>
                    { vacation.note }
                  </p>
                </div>
                <button onClick={()=> cancelVacation(vacation)}>Cancel</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Vacations;

