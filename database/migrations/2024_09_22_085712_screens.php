<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Screens extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('screens', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key (ID)
            $table->string('table_name'); // Column to store table name as a string
            $table->timestamps(); // Optional: includes 'created_at' and 'updated_at' timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('your_table_name');
    }
}
