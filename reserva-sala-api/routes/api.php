<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservaController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/reserva/v1/list',            [ReservaController::class, 'listaDadosReserva']);//end point curso lista dados
Route::post('/reserva/v1/insertreserva',  [ReservaController::class, 'inserirReserva']);//end point curso inserir dados
Route::post('/reserva/v1/updatereserva',  [ReservaController::class, 'alterarReserva']);//end point curso alterar dados
Route::post('/reserva/v1/excluirreserva', [ReservaController::class, 'excluirReserva']);//end point curso alterar dados
