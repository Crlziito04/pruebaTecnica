import { useMemo, useState } from "react";
import "./App.css";
import { SortBy } from "./types.d";
import { UsersList } from "./components/UsersList";
import { useUsers } from "./hooks/useUsers";
import { Results } from "./components/Results";

function App() {
  const { isError, isLoading, users, refetch, fetchNextPage, hasNextPage } =
    useUsers();

  // const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  //const originalUsers = useRef<User[]>([]);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(false);
  //const [currentPage, setCurrentPage] = useState(1);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleReset = async () => {
    await refetch();
    // setUsers(originalUsers.current);
  };

  //const handleDelete = (uuid: string) => {
  // const filteredUsers = users.filter((user) => {
  //   return user.login.uuid !== uuid;
  // });
  // setUsers(filteredUsers);
  // };

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

  // useEffect(() => {
  //   setLoading(true);
  //   setError(false);

  //   fetchUsers(currentPage)
  //     .then((users) => {
  //       setUsers((prevUsers) => {
  //         const newUsers = prevUsers.concat(users);
  //         originalUsers.current = newUsers;
  //         return newUsers;
  //       });
  //     })
  //     .catch((err) => setError(err))
  //     .finally(() => setLoading(false));
  // }, [currentPage]);

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
        <Results />
        {users.length > 0 && (
          <UsersList
            handleChangeSort={handleChangeSort}
            users={sortedUsers}
            showColors={showColors}
            //handleDelete={handleDelete}
          />
        )}
        {isLoading && <strong>Cargando...</strong>}
        {isError && <p>Ha habido un error</p>}
        {!isError && users.length === 0 && <p>No hay usuarios</p>}

        {!isLoading && !isError && hasNextPage === true && (
          <button onClick={() => void fetchNextPage()}>Mas Resultados</button>
        )}

        {!isLoading && !isError && hasNextPage === false && (
          <p>No Mas Resultados</p>
        )}
      </main>
    </div>
  );
}

export default App;
