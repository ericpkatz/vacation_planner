import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Vacations from './Vacations';

const VacationForm = ({ places, users, bookVacation })=> {
  const [placeId, setPlaceId] = useState('');
  const [userId, setUserId] = useState('');
  const [note, setNote] = useState('');

  const save = async(ev)=> {
    ev.preventDefault();
    const vacation = {
      user_id: userId,
      place_id: placeId,
      note
    };
    await bookVacation(vacation);
    setPlaceId('');
    setUserId('');
    setNote('');
  }
  return (
    <form onSubmit={ save }>
      <select value={ userId } onChange={ ev => setUserId(ev.target.value)}>
        <option value=''>-- choose a user --</option>
        {
          users.map( user => {
            return (
              <option key={ user.id } value={ user.id }>{ user.name }</option>
            );
          })
        }
      </select>
      <select value={ placeId } onChange={ ev => setPlaceId(ev.target.value)}>
        <option value=''>-- choose a place --</option>
        {
          places.map( place => {
            return (
              <option key={ place.id } value={ place.id }>{ place.name }</option>
            );
          })
        }
      </select>
      <input value={ note } onChange={ev =>setNote(ev.target.value)} />
      <button disabled={ !placeId || !userId  || !note}>Book Vacation</button>
    </form>
  );
}

const Users = ({ users, vacations, createUser })=> {
  const [name, setName ] = useState('');
  const save = async(ev)=> {
    ev.preventDefault();
    const user = {
      name
    }
    await createUser(user);
    setName('');
  };
  return (
    <div>
      <h2>Users ({ users.length })</h2>
      <ul>
        {
          users.map( user => {
            return (
              <li key={ user.id }>
                { user.name }
                ({ vacations.filter(vacation => vacation.user_id === user.id).length })
              </li>
            );
          })
        }
      </ul>
      <form onSubmit={ save }>
        <input placheholder='add name' value={ name } onChange={ ev => setName(ev.target.value)}/>
        <button disabled={!name}>Create User</button>
      </form>
    </div>
  );
};

const Places = ({ places, vacations })=> {
  return (
    <div>
      <h2>Places ({ places.length })</h2>
      <ul>
        {
          places.map( place => {
            return (
              <li key={ place.id }>
                { place.name }
                ({ vacations.filter(vacation => vacation.place_id === place.id).length })
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

const App = ()=> {
  const [users, setUsers] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [places, setPlaces] = useState([]);

  const dict = vacations.reduce((acc, vacation)=> {
    acc[vacation.place_id] = acc[vacation.place_id] || 0;
    acc[vacation.place_id]++;
    return acc;
  }, {});
  const max = Math.max(...Object.values(dict));
  const entries = Object.entries(dict);
  const popularIds = entries.filter(entry => entry[1] === max).map(entry => entry[0]*1);
  const popular = places.filter(place => popularIds.includes(place.id));

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/vacations');
      setVacations(response.data);
    }
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/places');
      setPlaces(response.data);
    }
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    }
    fetchData();
  }, []);

  const bookVacation = async(vacation)=> {
    const response = await axios.post('/api/vacations', vacation);
    setVacations([...vacations, response.data]);
  }

  const createUser = async(user)=> {
    console.log(user);
    const response = await axios.post('/api/users', user);
    setUsers([...users, response.data]);
  }

  const cancelVacation = async(vacation)=> {
    await axios.delete(`/api/vacations/${vacation.id}`);
    setVacations(vacations.filter(_vacation => _vacation.id !== vacation.id));
  }

  return (
    <div>
      <h1>Vacation Planner</h1>
      
      {
        popular.length ?
        (<div>Most popular trips are {
          popular.map( place => {
            return (
              <span key={place.id}>{ place.name }, </span>
            );
          })
        }</div>)
        : null
      }
      <VacationForm places={ places } users={ users } bookVacation={ bookVacation }/>
      <main>
        <Vacations
          vacations={ vacations }
          places={ places }
          users = { users }
          cancelVacation={ cancelVacation }
        />
        <Users
          createUser={ createUser }
          users={ users }
          vacations={ vacations }
        />
        <Places places={ places } vacations={ vacations }/>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
