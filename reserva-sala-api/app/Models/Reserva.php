<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reserva extends Model
{
    public $table = 'reserva_sala';

    public $timestamps = true;

    public $fillable=[

        'id',
        'res_data',
        'res_data_reserva',
        'res_hora_reserva',
        'res_nome_solicitante',
        'res_setor',
        'res_empresa',
        'res_situacao',
        'uuid'

    ];
}
