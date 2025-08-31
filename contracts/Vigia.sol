// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Vigia
 * @dev Smart contract para reportar y validar incidencias urbanas
 * @author Aleph Hackathon Team
 */
contract Vigia {
    struct Report {
        uint256 id;
        address creator;
        string latitude;
        string longitude;
        string imageHash; // CID de IPFS
        string description;
        uint256 timestamp;
        string status; // "Sin verificar" o "Verificado"
        address[] confirmations;
        string category; // Categoría del reporte (bache, semáforo, etc.)
    }

    uint256 private _reportCounter;
    mapping(uint256 => Report) public reports;
    mapping(uint256 => mapping(address => bool)) public hasConfirmed;

    // Configuración de validación
    uint256 public constant CONFIRMATION_THRESHOLD = 3;
    
    // Eventos
    event ReporteCreado(
        uint256 indexed id,
        address indexed creator,
        string imageHash,
        string category,
        uint256 timestamp
    );

    event ReporteValidado(
        uint256 indexed id,
        address indexed validator,
        string newStatus,
        uint256 confirmaciones
    );

    // Modificadores
    modifier reportExists(uint256 _reportId) {
        require(reports[_reportId].id != 0, "El reporte no existe");
        _;
    }

    modifier notReportCreator(uint256 _reportId) {
        require(reports[_reportId].creator != msg.sender, "No puedes validar tu propio reporte");
        _;
    }

    modifier notAlreadyConfirmed(uint256 _reportId) {
        require(!hasConfirmed[_reportId][msg.sender], "Ya has validado este reporte");
        _;
    }

    /**
     * @dev Crear un nuevo reporte de incidencia
     * @param _latitude Latitud de la ubicación
     * @param _longitude Longitud de la ubicación  
     * @param _imageHash Hash IPFS de la imagen
     * @param _description Descripción del problema
     * @param _category Categoría del reporte
     */
    function reportarIncidencia(
        string memory _latitude,
        string memory _longitude,
        string memory _imageHash,
        string memory _description,
        string memory _category
    ) public {
        require(bytes(_latitude).length > 0, "Latitud requerida");
        require(bytes(_longitude).length > 0, "Longitud requerida");
        require(bytes(_description).length > 0, "Descripcion requerida");
        require(bytes(_category).length > 0, "Categoria requerida");

        _reportCounter++;
        uint256 newReportId = _reportCounter;

        reports[newReportId] = Report({
            id: newReportId,
            creator: msg.sender,
            latitude: _latitude,
            longitude: _longitude,
            imageHash: _imageHash,
            description: _description,
            timestamp: block.timestamp,
            status: "Sin verificar",
            confirmations: new address[](0),
            category: _category
        });

        emit ReporteCreado(newReportId, msg.sender, _imageHash, _category, block.timestamp);
    }

    /**
     * @dev Validar un reporte existente
     * @param _reportId ID del reporte a validar
     */
    function validarReporte(uint256 _reportId) 
        public 
        reportExists(_reportId)
        notReportCreator(_reportId)
        notAlreadyConfirmed(_reportId)
    {
        Report storage reportToValidate = reports[_reportId];
        
        reportToValidate.confirmations.push(msg.sender);
        hasConfirmed[_reportId][msg.sender] = true;

        if (reportToValidate.confirmations.length >= CONFIRMATION_THRESHOLD) {
            reportToValidate.status = "Verificado";
        }

        emit ReporteValidado(
            _reportId, 
            msg.sender, 
            reportToValidate.status, 
            reportToValidate.confirmations.length
        );
    }

    /**
     * @dev Obtener todos los reportes
     * @return Array con todos los reportes
     */
    function getAllReports() public view returns (Report[] memory) {
        Report[] memory allReports = new Report[](_reportCounter);
        for (uint i = 0; i < _reportCounter; i++) {
            allReports[i] = reports[i + 1];
        }
        return allReports;
    }

    /**
     * @dev Obtener un reporte específico por ID
     * @param _reportId ID del reporte
     * @return El reporte solicitado
     */
    function getReport(uint256 _reportId) 
        public 
        view 
        reportExists(_reportId) 
        returns (Report memory) 
    {
        return reports[_reportId];
    }

    /**
     * @dev Obtener reportes por categoría
     * @param _category Categoría a filtrar
     * @return Array de reportes de la categoría especificada
     */
    function getReportsByCategory(string memory _category) 
        public 
        view 
        returns (Report[] memory) 
    {
        uint256 count = 0;
        
        // Contar reportes de la categoría
        for (uint i = 1; i <= _reportCounter; i++) {
            if (keccak256(bytes(reports[i].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }

        // Crear array del tamaño correcto
        Report[] memory categoryReports = new Report[](count);
        uint256 index = 0;

        // Llenar el array
        for (uint i = 1; i <= _reportCounter; i++) {
            if (keccak256(bytes(reports[i].category)) == keccak256(bytes(_category))) {
                categoryReports[index] = reports[i];
                index++;
            }
        }

        return categoryReports;
    }

    /**
     * @dev Obtener reportes por creador
     * @param _creator Dirección del creador
     * @return Array de reportes del creador especificado
     */
    function getReportsByCreator(address _creator) 
        public 
        view 
        returns (Report[] memory) 
    {
        uint256 count = 0;
        
        // Contar reportes del creador
        for (uint i = 1; i <= _reportCounter; i++) {
            if (reports[i].creator == _creator) {
                count++;
            }
        }

        // Crear array del tamaño correcto
        Report[] memory creatorReports = new Report[](count);
        uint256 index = 0;

        // Llenar el array
        for (uint i = 1; i <= _reportCounter; i++) {
            if (reports[i].creator == _creator) {
                creatorReports[index] = reports[i];
                index++;
            }
        }

        return creatorReports;
    }

    /**
     * @dev Obtener el número total de reportes
     * @return Número total de reportes
     */
    function getTotalReports() public view returns (uint256) {
        return _reportCounter;
    }

    /**
     * @dev Verificar si un usuario ya confirmó un reporte
     * @param _reportId ID del reporte
     * @param _user Dirección del usuario
     * @return true si ya confirmó, false si no
     */
    function hasUserConfirmed(uint256 _reportId, address _user) 
        public 
        view 
        returns (bool) 
    {
        return hasConfirmed[_reportId][_user];
    }
}
