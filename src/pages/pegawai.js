import React from 'react'
import axios from 'axios'
import {Button,Modal, Table, Card, Form} from 'react-bootstrap' 

class Pegawai extends React.Component {
    constructor() {  
        super();  
        this.state = {
            pegawai: [],
            id_pegawai: "",  
            nama_pegawai: "",  
            alamat: "",  
            search: "", 
            action: "", 
          isModal10open: false
        }  
    }
    bind = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleAdd = () => {
        this.setState({
            id_pegawai: "",
            nama_pegawai: "",
            alamat: "",
            action: "insert",
            isModalOpen: true
        })
    }
    handleEdit = (item) => {
        this.setState({
            id_pegawai: item.id_pegawai,
            nama_pegawai: item.nama_pegawai,
            alamat: item.alamat,
            action: "update",
            isModalOpen: true
        })
    }
    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }
    getPegawai = () => {
        let url = "http://localhost:2910/pegawai";
        // mengakses api untuk mengambil data pegawai
        axios.get(url)
        .then(response => {
          // mengisikan data dari respon API ke array pegawai
          this.setState({pegawai: response.data.pegawai});
        })
        .catch(error => {
          console.log(error);
        });
    }
    findPegawai = (event) => {
        let url = "http://localhost:2910/pegawai";
        if (event.keyCode === 13) {
        //   menampung data keyword pencarian
          let form = {
            find: this.state.search
          }
          // mengakses api untuk mengambil data pegawai
          // berdasarkan keyword
          axios.post(url, form)
          .then(response => {
            // mengisikan data dari respon API ke array pegawai
            this.setState({pegawai: response.data.pegawai});
          })
          .catch(error => {
            console.log(error);
          });
        }
    }
    handleSave = (event) => {
        event.preventDefault();
        /* menampung data nip, nama dan alamat dari Form
        ke dalam FormData() untuk dikirim  */
        let url = "";
        if (this.state.action === "insert") {
          url = "http://localhost:2910/pegawai/save"
        } else {
          url = "http://localhost:2910/pegawai/update"
        }
    
        let form = {
          id_pegawai: this.state.id_pegawai,
          nama_pegawai: this.state.nama_pegawai,
          alamat: this.state.alamat
        }
    
        // mengirim data ke API untuk disimpan pada database
        axios.post(url, form)
        .then(response => {
          // jika proses simpan berhasil, memanggil data yang terbaru
          this.getPegawai();
        })
        .catch(error => {
          console.log(error);
        });
        //menutup form modal
        this.setState({
            isModalOpen: false
        })
    }
    componentDidMount(){
        // method yang pertama kali dipanggil pada saat load page
        this.getPegawai()
    }
    Drop = (id_pegawai) => {
        let url = "http://localhost:2910/pegawai/" + id_pegawai;
        // memanggil url API untuk menghapus data pada database
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
          axios.delete(url)
          .then(response => {
            // jika proses hapus data berhasil, memanggil data yang terbaru
            this.getPegawai();
          })
          .catch(error => {
            console.log(error);
          });
        }
    }
    render(){
        console.log(this.state.pegawai)
        console.log(this.state.action)
        return(
            <>
                <Card>
                <Card.Header className="card-header bg-info text-white" align={'center'}>Data Pegawai</Card.Header>
                <Card.Body>
                <input type="text" className="form-control mb-2" name="search" value={this.state.search} onChange={this.bind} onKeyUp={this.findPegawai} placeholder="Pencarian..." />
                <Button variant="success" onClick={this.handleAdd}>
                    Tambah Data
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>  
                            <th>Nama</th>  
                            <th>Alamat</th>  
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.pegawai.map((item,index) => {  
                        return (  
                        <tr key={index}>  
                            <td>{item.id_pegawai}</td>  
                            <td>{item.nama_pegawai}</td>  
                            <td>{item.alamat}</td>  
                            <td>  
                            <Button className="btn btn-sm btn-info m-1" data-toggle="modal"  
                            data-target="#modal" onClick={() => this.handleEdit(item)}>  
                                Edit  
                            </Button>  
                            <Button className="btn btn-sm btn-danger m-1" onClick={() => this.Drop(item.id_pegawai)}>  
                                Hapus  
                            </Button>  
                            </td>  
                        </tr>  
                        );  
                    })}
                    </tbody>
                    </Table>
                </Card.Body>
                </Card>
                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Pegawai</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleSave}>
                    <Modal.Body>
                        ID 
                        <input type="number" name="id_pegawai" value={this.state.id_pegawai} onChange={this.bind}  
                        className="form-control" required />  
                        Nama  
                        <input type="text" name="nama_pegawai" value={this.state.nama_pegawai} onChange={this.bind}  
                        className="form-control" required />  
                        Alamat  
                        <input type="text" name="alamat" value={this.state.alamat} onChange={this.bind}  
                        className="form-control" required />  
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-sm btn-success" type="submit">  
                            Simpan  
                        </button>  
                    </Modal.Footer>
                    </Form>
                </Modal>
            </>
    );  
  }
}

export default Pegawai
