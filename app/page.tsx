"use client";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ThemeProvider } from "@material-tailwind/react";
import { Select, Option } from "@material-tailwind/react";
import { useCookies } from "react-cookie";
import React, { ChangeEvent } from 'react';

export default function Home() {
  const [libros, setLibros] = useState<Object[]>([]);
  const [librostotal, setLibrostotal] = useState<Object[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  const [lectura, setLectura] = useState<Object[]>([]);
  const [generos, setGeneros] = useState<Object[]>(["Ninguno"]);
  const [cantPaginas, setCantPaginas] = useState(0);
  const [cantidadLectura, setCantidadLectura] = useState<number>(0);

  const [cookies, setCookie] = useCookies(["lectura"]);

  useEffect(() => {
    const URL = "http://localhost:3001/library";
    const respuesta = axios.get(URL).then((res) => {
      setLibros(res.data);
      setCantidad(res.data.length);
      console.log(res.data);
      setLibrostotal(res.data);
      setLectura(cookies.lectura);
    });
  }, []);

  arreglarcat();

  function arreglarcat() {
    libros.map((l:any) => {
      let yaesta = false;

      generos.map((gen) => {
        if (gen === l.book.genre) {
          yaesta = true;
        }
      });

      !yaesta && setGeneros([...generos, l.book.genre]);

      yaesta = false;
    });
  }

  useEffect(() => {
    setCantidadLectura(lectura.length);

    lectura.length !== 0 &&
      setCookie("lectura", JSON.stringify(lectura), { path: "/" });
    console.log(cookies.lectura);
  }, [lectura]);

  useEffect(() => {
    libros.length === 0 && setLibros(librostotal);
  }, [libros, librostotal]);

  const filtrado = (e:any) => {
    setCantPaginas(e);
    if (parseInt(e) <= 42) {
      setLibros(librostotal);
    } else {
      let newarreglo = librostotal.filter((l:any) => {
        return l.book.pages < cantPaginas;
      });
      setLibros(newarreglo);
    }
  };

  return (
    <ThemeProvider>
      <main className=" w-screen h-screen p-20">
        <div className="flex justify-center">
          <div className="lado isquierdo">
            <h1 className="text-white text-3xl">
              {cantidad} libros disponibles
            </h1>
            <h2 className="text-white text-xl">
              {cantidadLectura} en lista de lectura
            </h2>

            <div className="flex flex-row row-2 gap-20 mt-10">
              <div>
                <h2 className="text-white text-xl">
                  {" "}
                  Filtrar por páginas {cantPaginas !== 0 && cantPaginas}
                </h2>
                <input
                  type="range"
                  min={0}
                  max="2000"
                  value={cantPaginas}
                  onChange={filtrado}
                  className="accent-slate-500  my-4 bg-transparent "
                />
              </div>
              <div>
                <h2 className="text-white text-xl"> Filtrar por género</h2>
                <div className="flex w-40 h-auto my-2 flex-col bg-transparent gap-6">
                  {generos.length !== 0 && (
                    <Select
                      onChange={(e) => {
                        setLibros(
                          librostotal.filter((lib:any) => {
                            let indice:any=e
                            
                            return lib.book.genre === generos[parseInt(indice)];
                            
                          })
                        );
                      }}
                      color="blue"
                      label="Seleciona el Genero"
                    >             
                      {generos.map((l:any, i:number) => {
                        return (
                          <Option value={`${i}`} key={i}>
                            {" "}
                            {l}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 transition-all ">
              {libros.length !== 0 &&
                libros.map((l:any, i:number) => {
                  return (
                    <Image
                      key={i}
                      onClick={() => { !lectura.includes(l)&& setLectura([...lectura, libros[i]]);
                      }}
                      alt="Imagenes"
                      className="mr-7 my-7"
                      width={80}
                      height={80}
                      src={l.book.cover}
                    ></Image>
                  );
                })}
            </div>
          </div>

          <div className="ml-32 bg-gray-900 px-14 py-6 border-2 items-center justify-center relative  border-gray-700 rounded-md">
            <h1 className="text-white text-3xl text-center">
              Lista de Lectura
            </h1>
            <div className="grid grid-cols-2">
              {lectura.length !== 0 &&
                lectura.map((l:any, i:number) => {
                  return (
                    <Image
                      key={i}
                      onClick={() => {
                        let arrnew = lectura.filter((l) => {
                          return l !== lectura[i];
                        });
                        setLectura(arrnew);
                      }}
                      alt="Imagenes"
                      className="mr-7 my-7"
                      width={80}
                      height={80}
                      src={l.book.cover}
                    ></Image>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
