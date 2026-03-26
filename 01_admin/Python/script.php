<?php
//Executar script Python (.py):

// Usa o interpretador python instalado no sistema
$comando = escapeshellcmd('python C:\caminho\para\script.py');
$resultado = shell_exec($comando);
echo $resultado;


//Executar .exe gerado (PyInstaller):
//Se você converteu seu script com pyinstaller --onefile, chame-o diretamente:

// Executa o arquivo compilado diretamente
$comando = escapeshellcmd('C:\caminho\para\dist\meu_script.exe');
$resultado = shell_exec($comando);
echo $resultado;
?>