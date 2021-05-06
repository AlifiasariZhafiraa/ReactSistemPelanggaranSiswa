import React from 'react'
import axios from "axios";
import NavBar from '../components/navbar'
import {Button, Modal, Table, Card, Form} from 'react-bootstrap'
import dateFormat from 'dateformat';


class PelanggaranSiswa extends React.Component {
    constructor() {  
        super();  
        this.state = {
            token: "",
            siswa: [],
            pelanggaran: [],
            pelanggaran_siswa: [],
            detail_pelanggaran_siswa: [],
            list_pelanggaran: [],
            id_pelanggaran_siswa: "",
            id_pelanggaran: "",
            isModal1Open: false,
            isModal2Open: false,
            isModal3Open: false
        }  
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    bind = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    getSiswa = () => {
        let url = "http://localhost:2910/siswa";
        // mengakses api untuk mengambil data siswa
        axios.get(url, this.headerConfig())
        .then(response => {
          // mengisikan data dari respon API ke array siswa
          this.setState({siswa: response.data.siswa});
        })
        .catch(error => {
          console.log(error);
        });
    }

    getPelanggaran = () => {
        let url = "http://localhost:2910/pelanggaran";
        // mengakses api untuk mengambil data pelanggaran
        axios.get(url, this.headerConfig())
        .then(response => {
          // mengisikan data dari respon API ke array pelanggaran
          this.setState({pelanggaran: response.data.pelanggaran});
        })
        .catch(error => {
          console.log(error);
        });
    }

    getPelanggaranSiswa = () => {
        let url = "http://localhost:2910/pelanggaran_siswa";
        // mengakses api untuk mengambil data pelanggaran
        axios.get(url, this.headerConfig())
        .then(response => {
          // mengisikan data dari respon API ke array pelanggaran
          this.setState({pelanggaran_siswa: response.data.pelanggaran_siswa});
        })
        .catch(error => {
          console.log(error);
        });
    }

    componentDidMount(){  
        this.getPelanggaranSiswa();  
        this.getSiswa();  
        this.getPelanggaran();  
    }

    handleClose = () => {
        this.setState({
            isModal1Open: false,
            isModal2Open: false,
            isModal3Open: false
        })
    }

    handleDetail = (id_pelanggaran_siswa) => {
        let url = "http://localhost:2910/detail_pelanggaran_siswa/ " + id_pelanggaran_siswa;
        // mengakses api untuk mengambil data pelanggaran
        axios.get(url, this.headerConfig())
        .then(response => {
          // mengisikan data dari respon API ke array pelanggaran
          this.setState({detail_pelanggaran_siswa: response.data.detail_pelanggaran_siswa});
          this.setState({id_pelanggaran_siswa: id_pelanggaran_siswa, isModal1Open:true})
        })
        .catch(error => {
          console.log(error);
        });
    }

    addPelanggaran = () => {
        this.setState({
            id_pelanggaran: "",
            isModal1Open: false,
            isModal2Open: true
        })
    }

    savePelanggaran = (event) => {
        event.preventDefault();
        let url = "http://localhost:2910/detail_pelanggaran_siswa";
        let id = this.state.id_pelanggaran_siswa
        let form = {
          id_pelanggaran_siswa: id,
          id_pelanggaran: this.state.id_pelanggaran
        }
    
        // mengirim data ke API untuk disimpan pada database
        axios.post(url, form, this.headerConfig())
        .then(response => {
          // jika proses simpan berhasil, memanggil data yang terbaru
          this.handleDetail(id);
          // menutup form modal
            this.setState({
            isModal2Open: false
        })
        })
        .catch(error => {
          console.log(error);
        });
    }

    dropPelanggaran = (item) => {
        this.setState({isModal1Open: false})
        let url = "http://localhost:2910/detail_pelanggaran_siswa/" + item.id_pelanggaran_siswa + "/" + item.id_pelanggaran;
        // memanggil url API untuk menghapus data pada database
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
          axios.delete(url, this.headerConfig())
          .then(response => {
            // jika proses hapus data berhasil, memanggil data yang terbaru
            this.handleDetail(item.id_pelanggaran_siswa);
          })
          .catch(error => {
            console.log(error);
          });
        }
    }

    handleAdd = () => {  
        this.setState({  
            id_siswa: "",  
            id_pelanggaran: "",  
            list_pelanggaran: [],
            isModal3Open: true  
        });  
    }
    
    addList = () => {  
        if (this.state.id_pelanggaran !== "") {  
        let id = this.state.id_pelanggaran;
        let item = this.state.pelanggaran.find(itm => itm.id_pelanggaran == id);  
        console.log(item);  
        let temp = this.state.list_pelanggaran;  
        temp.push(item);  
        this.setState({list_pelanggaran: temp});  
        }  
    }
    
    dropList = (index) => {  
        let temp = this.state.list_pelanggaran;  
        temp.splice(index,1);  
        this.setState({list_pelanggaran: temp});  
    }
    
    handleSave = (event) => {  
        event.preventDefault();  
        let url = "http://localhost:2910/pelanggaran_siswa/save";  
        // ambil data user dari local storage  
        let user = JSON.parse(localStorage.getItem("user"));
        let form = {
            id_siswa: this.state.id_siswa,
            id_user: user[0].id_user,
            pelanggaran: JSON.stringify(this.state.list_pelanggaran)
        }
        axios.post(url, form, this.headerConfig())  
        .then(response => {    
            this.getPelanggaranSiswa();  
            this.setState({list_pelanggaran: [], isModal3Open: false});    
        })  
        .catch(error => {  
            console.log(error);  
        });  
    }
    
    handleDrop = (id_pelanggaran_siswa) => {
        let url = "http://localhost:2910/pelanggaran_siswa/" + id_pelanggaran_siswa;
        // memanggil url API untuk menghapus data pada database
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            axios.delete(url, this.headerConfig())
            .then(response => {
            // jika proses hapus data berhasil, memanggil data yang terbaru
            this.setState({message: response.data.message});  
            this.getPelanggaranSiswa();
            })
            .catch(error => {
            console.log(error);
            });
        }    
    }
    
    render(){
        return(
            <>
                <NavBar />
                <Card>
                <Card.Header className="card-header bg-info text-white" align={'center'}>Data Pelanggaran Siswa</Card.Header>
                <Card.Body>
                    <Button variant="success" onClick={this.handleAdd}>
                        Tambah Data
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <td>Tanggal</td>
                            <td>NIS</td> 
                            <td>Nama Siswa</td>  
                            <td>Nama Petugas</td>
                            <td>Option</td>
                            </tr>
                        </thead>
                        <tbody>
                        { this.state.pelanggaran_siswa.map(item => {  
                        return(  
                            <tr key={item.id_pelanggaran_siswa}>  
                            <td>{dateFormat(item.waktu)}</td>
                            <td>{item.nis}</td>  
                            <td>{item.nama_siswa}</td>
                            <td>{item.username}</td>
                            <td>
                                <Button className="btn btn-sm btn-info m-1" 
                                onClick={() => this.handleDetail(item.id_pelanggaran_siswa)}> Detail </Button>
                                <Button className="btn btn-sm btn-danger m-1" 
                                onClick={() => this.handleDrop(item.id_pelanggaran_siswa)}> Hapus </Button> 
                            </td>  
                            </tr>  
                        );  
                        }) }
                        </tbody>
                    </Table>
                </Card.Body>
                </Card>
                {/* Modal Detail Pelanggaran */}
                <Modal show={this.state.isModal1Open} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Detail Pelanggaran Siswa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="success" onClick={() => this.addPelanggaran()}>
                            Tambah Data
                        </Button>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <td>Id</td>  
                                <td>Pelanggaran</td>  
                                <td>Poin</td>
                                <td>Option</td>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.detail_pelanggaran_siswa.map(it => {  
                                    return(  
                                    <tr key={it.id_pelanggaran_siswa}>
                                        <td>{it.id_pelanggaran}</td>
                                        <td>{it.nama_pelanggaran}</td>  
                                        <td>{it.poin}</td>
                                        <td>  
                                            <Button className="btn btn-sm btn-danger m-1" onClick={() => this.dropPelanggaran(it)}>  
                                                Hapus  
                                            </Button>
                                        </td>
                                    </tr>
                                    );  
                                }) }
                            </tbody>
                        </Table> 
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                {/* Modal Add Pelanggaran */}
                <Modal show={this.state.isModal2Open} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Tambah Pelanggaran</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.savePelanggaran}>
                        <Modal.Body>
                            Pilih Pelanggaran  
                            <select name="id_pelanggaran" className="form-control"  
                            value={this.state.id_pelanggaran}  
                            onChange={this.bind} required>  
                            <option value="">-- Pilih Pelanggaran --</option>  
                                { this.state.pelanggaran.map(item => {  
                                    return (  
                                    <option key={item.id_pelanggaran} value={item.id_pelanggaran}>  
                                        {item.nama_pelanggaran}  
                                    </option>  
                                    );  
                                }) }  
                            </select>  
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-sm btn-success" type="submit">  
                                Simpan  
                            </button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Modal Add Data Pelanggaran Siswa*/}
                <Modal show={this.state.isModal3Open} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Pelanggaran Siswa</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleSave}>
                        <Modal.Body>
                        Nama Siswa  
                            <select name="id_siswa" className="form-control" value={this.state.id_siswa}  
                            onChange={this.bind} required>  
                            <option value="">-- Pilih Siswa --</option>  
                                { this.state.siswa.map(item => {  
                                    return (  
                                    <option key={item.id_siswa} value={item.id_siswa}>  
                                        {item.nama_siswa}  
                                    </option>  
                                    );  
                                }) }  
                            </select>  
                            Pilih Pelanggaran  
                            <select name="id_pelanggaran" className="form-control"  
                            value={this.state.id_pelanggaran}  
                            onChange={this.bind} required>  
                            <option value="">-- Pilih Pelanggaran --</option>  
                                { this.state.pelanggaran.map(item => {  
                                    return (  
                                    <option key={item.id_pelanggaran} value={item.id_pelanggaran}>  
                                        {item.nama_pelanggaran}  
                                    </option>  
                                    );  
                                }) }  
                            </select>  
                            <button type="button" className="btn btn-block btn-sm btn-primary my-1"  
                            onClick={() => this.addList()}> Tambahkan Pelanggaran </button>  
                            Jenis Pelanggaran: <br />  
                            <ul>  
                                {this.state.list_pelanggaran.map((item,index) => {  
                                    return (  
                                    <li key={item.id_pelanggaran+index}>  
                                        {item.nama_pelanggaran}  
                                        [<a className="text-danger" onClick={() => this.dropList(index)}>X</a>]  
                                    </li>  
                                    );  
                                })}  
                            </ul>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-sm btn-success" type="submit">  
                                Simpan  
                            </button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        )    
  }
}

export default PelanggaranSiswa 
