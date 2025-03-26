export const columnDefs = [

    {
        headerName: "Country Name",
        field: "name",
        sortable: true,
        filter: true,
        width: 300,
    },
    {
        headerName: "Currency",
        field: "currency",
        width: 300,
        valueGetter: (params) => {
            if (!params.data || !params.data.currency) return "";
            return params.data.currency.map(c => `${c.code} | ${c.name} | ${c.symbol}`).join(", ");
        }
    },
    {
        headerName: "Capital",
        field: "capital",
        sortable: true,
        filter: true,
        width: 250,
    },
    {
        headerName: "Languages",
        field: "languages",
        sortable: true,
        filter: true,
        width: 350,
    },

    {
        headerName: "Flag",
        field: "flag",
        sortable: true,
        filter: true,
        width: 320,

      },
      
  ];
  