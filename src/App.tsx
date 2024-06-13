import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { SortBy, type User } from "./types.d";
import { UsersList } from "./components/UsersList";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const originalUsers = useRef<User[]>([]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => {
      return user.login.uuid !== uuid;
    });
    setUsers(filteredUsers);
  };

  const toggleSortCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const filterUsersByCountry = useMemo(() => {
    return typeof filterCountry === "string" && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  //*Calcula este ordenamiento solo cuando cambian las dependencias
  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.COUNTRY) {
      return filterUsersByCountry.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country);
      });
    }

    if (sorting === SortBy.NAME) {
      return filterUsersByCountry.toSorted((a, b) => {
        return a.name.first.localeCompare(b.name.first);
      });
    }

    if (sorting === SortBy.LAST) {
      return filterUsersByCountry.toSorted((a, b) => {
        return a.name.last.localeCompare(b.name.last);
      });
    }
    return filterUsersByCountry;
  }, [filterUsersByCountry, sorting]);

  useEffect(() => {
    fetch(`https://randomuser.me/api?results=100`)
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1>Prueba Tecnica</h1>
      <header>
        <button onClick={toggleSortCountry}>
          {sorting === SortBy.COUNTRY ? "No Ordenar" : "Ordenar por Pais"}
        </button>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={handleReset}>Reset Estado</button>

        <input
          type="text"
          placeholder="Filtra por Pais"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        <UsersList
          handleChangeSort={handleChangeSort}
          users={sortedUsers}
          showColors={showColors}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
